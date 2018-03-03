import Route from '@ember/routing/route';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';

const { Logger } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  ajax: service(),
  store: service(),

  endpoints: {
    bidders: 'nodes',
    buyers: 'nodes',
    relationships: ''
  },
  controller: computed(function() {
    return this.controllerFor('network.show.details.show');
  }),

  // get the bidders/ buyers based on contracts
  processContracts(winningBids, endpoint) {
    let ids = [];
    let nodes = {};

    // if is a buyer
    if (endpoint === 'bidders') {
      let buyers = [];
      _.forEach(winningBids, function (bid) {
        buyers = _.unionBy(buyers, bid.lot.tender.buyers, 'id');
      });
       // console.log('uniquer buyers', buyers);
      return buyers;

    } else {
      // if we are in a bidder
      let bidders = [];
      _.forEach(winningBids, function (bid) {
        bidders = _.unionBy(bidders, bid.bidders, 'id');
      });
      // console.log('uniquer bidders', bidders);
      return bidders;
    }

  },

  // node = node or cluster
  // nodeId = node or node ids of cluster
  // endpoint = type of node
  // filterById in relationships = ids of the procuring entity to filter the contracts by
  getModelDetails(nodeId, endpoint, filterById) {
    let self = this;
    let dataEntity = {};

    // let endpointQ = this.endpoints[endpoint];
    let networkModel = this.modelFor('network.show');
    let networkId  = networkModel.get('id');
    let { years } = networkModel.get('query');
    let { countries } = networkModel.get('query');

    dataEntity.firstYear = _.head(years);
    dataEntity.lastYear = _.last(years);
    dataEntity.countries = countries;
    dataEntity.networkId = networkId;

    // console.log('dataEntity  before request', dataEntity);
    // console.log(`/networks/${networkId}/${this.endpoints[endpoint]}/${nodeId}`);

    return this.get('ajax')
      .request(`/networks/${networkId}/${this.endpoints[endpoint]}/${nodeId}`)
      .then(
        (data) => {
          Object.assign(dataEntity, data.node);
          // console.log('dataEntity - after request', dataEntity);
          // extract the unique buyers / bidders for bidder / buyer
          dataEntity.nodes = self.processContracts(dataEntity.winningBids, endpoint);
          dataEntity.contractsCount = dataEntity.winningBids.length;
          // only if we are not in a relationship
          // relationships do not requier the bidders/ buyers
          /*if (!filterById) {
            dataEntity = self.processContracts(dataEntity, endpoint);
          }*/

          this.titleToken = dataEntity.name;
          return dataEntity;
        }, (response) => {
          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  // not sure if this is needed anymore
  setNodeDetails(nodeId, endpoint, filterContracts) {
    let node =  this.get('networkService').getNodeById(nodeId);
    let requestedIds = [nodeId];

    // if it is a cluster get the ids of nodes in that cluster
    // should check in another way

    /*if (this.get('networkService').get('network.network').clustering.isCluster(nodeId)) {
      // get the nodes in that cluster
      let clusterDetails = _.find(this.get('networkService.clusters'), (o) => {
        return o.id == nodeId;
      });
      requestedIds = clusterDetails.node_ids;
    }*/

    return this.getModelDetails(node, requestedIds, endpoint, filterContracts);
  },

  setModelDetails() {
    let controller =  this.get('controller');
    let params =  controller.get('params');
    // bidder,buyers || relationships
    let endpoint  = this.paramsFor('network.show.details').tab;

    if (endpoint === 'relationships') {
      let [from,to] = _.split(params.id, '-');
      let fromId = [from];
      // find node
      let fromNode = this.get('networkService').getNodeById(from);
      // determine if from is node or cluster
      if (this.get('networkService').get('network.network').clustering.isCluster(from)) {
        let clusterDetails = _.find(this.get('networkService.clusters'), (o) => {
          return o.id == from;
        });
        fromId = clusterDetails.node_ids;
      }

      // & filterContracts by queryIds, by the buyer id or ids (if cluster)
      this.setNodeDetails(to, 'bidders', fromId).then((dataTo) => {
        controller.set('modelDetails', { 'from': { 'name': fromNode.label }, 'to': dataTo });
        controller.set('readyToRender', true);

      }).catch((error) => {
        Logger.error('Error:', error);
      });

    } else {
      // for a single node
      // setNodeDetails(nodeId, endpoint, filterContracts)
      this.getModelDetails(params.id, endpoint, false).then((data) => {
        controller.set('modelDetails', data);
        controller.set('readyToRender', true);
      });
    }
  },
  networkLoaded: observer('networkService.isReady', function() {
    // if the network service is Ready and the data is not yet set
    if (this.get('networkService.isReady')
      && !this.get('controller').get('readyToRender')
    ) {
      this.setModelDetails();
    }
  }),

  model(params,transition) {
    this.get('controller').set('params', params);
    let { tab } = transition.params['network.show.details'];
    this.set('tab', tab);
    this.get('controller').set('tab', tab);

    if (this.get('networkService.isReady')) {
      this.get('controller').set('modelDetails', undefined);
      this.get('controller').set('readyToRender', false);
      this.setModelDetails();
    }
  },

  setupController(controller/*, model, transition*/) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);
    // reset to default tabs
    controller.set('activeTabDetails', 'contracts');
    controller.set('activeTabbuyer', 'contracts');
  },

  actions: {
    loading(transition) {
      let controller = this.controllerFor('network.show.details');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
      });
    },
    closeDetails() {
      this.transitionTo(
        'network.show.details',
        this.controllerFor('network.show.details').get('activeTab')
      );
    }
  }
});
