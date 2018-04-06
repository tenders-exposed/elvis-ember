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
    relationships: 'edges',
    clusters: 'clusters'
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
      _.forEach(winningBids, function(bid) {
        buyers = _.unionBy(buyers, bid.lot.tender.buyers, 'id');
      });
      // console.log('uniquer buyers', buyers);
      return buyers;

    } else {
      // if we are in a bidder
      let bidders = [];
      _.forEach(winningBids, function(bid) {
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
    let idParts = _.split(nodeId, '_');
    nodeId = _.last(idParts);
    // if we have multiple parts like c-id then we have a cluster endpoint
    let endpointQ = idParts.length > 1 ? 'clusters' : endpoint;

    let networkModel = this.modelFor('network.show');
    let networkId  = networkModel.get('id');
    let { years } = networkModel.get('query');
    let { countries } = networkModel.get('query');

    dataEntity.firstYear = _.head(years);
    dataEntity.lastYear = _.last(years);
    dataEntity.countries = countries;
    dataEntity.networkId = networkId;

    // console.log('dataEntity  before request', dataEntity);
    // console.log(`/networks/${networkId}/${this.endpoints[endpointQ]}/${nodeId}`);

    return this.get('ajax')
      .request(`/networks/${networkId}/${this.endpoints[endpointQ]}/${nodeId}`)
      .then(
        (data) => {

          // extract the unique buyers / bidders for bidder / buyer
          if (endpointQ != 'relationships') {
            if (endpointQ == 'clusters') {
              Object.assign(dataEntity, data.cluster);
              dataEntity.nodes = self.processContracts(dataEntity.winningBids, endpoint);

            } else {
              Object.assign(dataEntity, data.node);
              dataEntity.nodes = self.processContracts(dataEntity.winningBids, endpoint);
              this.titleToken = dataEntity.name;
            }

            dataEntity.contracts = [];
            _.each(dataEntity.winningBids, function (bid) {
              let contract = {
                tenderId: bid.lot.tender.id,
                title: bid.lot.title ? `${bid.lot.tender.title} - ${bid.lot.title}` : bid.lot.tender.title,
                buyers: bid.lot.tender.buyers,
                bidders: bid.bidders,
                bids: bid.lot.bidsCount,
                value: bid.value
              };
              dataEntity.contracts.push(contract);
            });

          } else {
            Object.assign(dataEntity, data.edge);
            dataEntity.contracts = [];
            _.each(dataEntity.winningBids, function (bid) {
              let contract = {
                tenderId: bid.lot.tender.id,
                title: bid.lot.title ? `${bid.lot.tender.title} - ${bid.lot.title}` : bid.lot.tender.title,
                date: bid.lot.awardDecisionDate,
                bids: bid.lot.bidsCount,
                value: bid.value
              };
              dataEntity.contracts.push(contract);
            });
          }
          // console.log('dataEntity - after request', dataEntity);
          dataEntity.contractsCount = dataEntity.winningBids.length;
          return dataEntity;

        }, (response) => {
          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  setModelDetails() {
    let controller =  this.get('controller');
    let params =  controller.get('params');
    // bidder,buyers || relationships
    let endpoint  = this.paramsFor('network.show.details').tab;

    if (endpoint === 'relationships') {
      let edge = this.get('networkService').getEdgeById(params.id);

      this.getModelDetails(params.id, endpoint, false).then((data) => {
        data.fromLabel =  edge.fromLabel;
        data.toLabel =  edge.toLabel;

        controller.set('modelDetails', data);
        controller.set('readyToRender', true);
      }).catch((error) => {
        Logger.error('Error:', error);
      });

    } else {
      // for a single node
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
