import Route from '@ember/routing/route';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

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
    if (endpoint === 'bidders') {
      let buyers = [];
      _.forEach(winningBids, function(bid) {
        buyers = _.unionBy(buyers, bid.lot.tender.buyers, 'id');
      });
      return buyers;

    } else {
      let bidders = [];
      _.forEach(winningBids, function(bid) {
        bidders = _.unionBy(bidders, bid.bidders, 'id');
      });
      return bidders;
    }

  },

  // node = node or cluster
  // nodeId = node or node ids of cluster
  // endpoint = type of node
  // filterById in relationships = ids of the procuring entity to filter the contracts by
  getModelDetails(nodeId, endpoint/*, filterById*/) {
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

    let options = {};
    options.headers = {
      'Content-Type': 'application/json'
    };

    return this.get('ajax')
      .request(`/networks/${networkId}/${this.endpoints[endpointQ]}/${nodeId}`,{
       data: options
      })
      .then(
        (data) => {
          // extract the unique buyers / bidders for bidder / buyer
          if (endpointQ != 'relationships') {
            if (endpointQ == 'clusters') {
              Object.assign(dataEntity, data.cluster);
              dataEntity.nodes = self.processContracts(data.cluster.winningBids, endpoint);

            } else {
              Object.assign(dataEntity, data.node);
              dataEntity.nodes = self.processContracts(data.node.winningBids, endpoint);
              this.titleToken = dataEntity.name;
            }

            dataEntity.contracts = [];
            _.each(dataEntity.winningBids, function(bid) {
              let contract = {
                tenderId: bid.lot.tender.id,
                title: bid.lot.title ? `${bid.lot.tender.title} - ${bid.lot.title}` : bid.lot.tender.title,
                buyers: bid.lot.tender.buyers,
                bidders: bid.bidders,
                bids: bid.lot.bidsCount,
                value: bid.value,
                year: bid.lot.tender.year,
                source: bid.lot.tender.sources[0],
                xYearApproximated: bid.lot.tender.xYearApproximated,
                xAmountApproximated: bid.lot.tender.xAmountApproximated
              };
              dataEntity.contracts.push(contract);
            });
            dataEntity.contractsCount = dataEntity.winningBids.length;

          } else {
            Object.assign(dataEntity, data.edge);
            dataEntity.contracts = [];
            _.each(data.edge.winningBids, function(bid) {
              let contract = {
                tenderId: bid.lot.tender.id,
                title: bid.lot.title ? `${bid.lot.tender.title} - ${bid.lot.title}` : bid.lot.tender.title,
                date: bid.lot.awardDecisionDate,
                bids: bid.lot.bidsCount,
                value: bid.value,
                year: bid.lot.tender.year,
                source: bid.lot.tender.sources[0],
                xYearApproximated: bid.lot.tender.xYearApproximated,
                xAmountApproximated: bid.lot.tender.xAmountApproximated
              };
              dataEntity.contracts.push(contract);
            });
            dataEntity.contractsCount = data.edge.winningBids.length;

          }
          // console.log('dataEntity - after request', dataEntity);
          return dataEntity;

        });
  },

  setModelDetails() {
    let controller =  this.get('controller');
    let params =  controller.get('params');
    // bidder,buyers || relationships
    let endpoint  = this.paramsFor('network.show.details').tab;
    let self = this;

    if (endpoint === 'relationships') {
      let edge = self.get('networkService').getEdgeById(params.id);

      return self.getModelDetails(params.id, endpoint, false).then((data) => {
        data.fromLabel =  edge.fromLabel;
        data.toLabel =  edge.toLabel;
        return data;
      });
    } else {
      // for a single node
      return self.getModelDetails(params.id, endpoint, false).then((data) => {
        return data;
      });
    }
  },

  model(params,transition) {

    let self = this;
    let controller =  this.get('controller');
    let { tab } = transition.params['network.show.details'];
    let endpoint  = this.paramsFor('network.show.details').tab;

    this.set('tab', tab);
    controller.set('params', params);
    controller.set('tab', tab);
    controller.set('modelDetails', undefined);

    return this.controllerFor('network.show').get('networkDefer').then(() => {
      // console.log('start model');
      let details;
      // bidder,buyers || relationships
      if (endpoint === 'relationships') {
          let edge = self.get('networkService').getEdgeById(params.id);
          details =  self.getModelDetails(params.id, endpoint, false).then((data) => {
          data.fromLabel =  edge.fromLabel;
          data.toLabel =  edge.toLabel;
          controller.set('modelDetails', data);
          return data;
        });
        // console.log('finish model', details);
        return details;

      } else {
        // for a single node
          details =  self.getModelDetails(params.id, endpoint, false).then((data) => {
          controller.set('modelDetails', data);
          return data;
        });
        // console.log('finish model', details);
        return details;
      }
    });

  },

  setupController(controller/*, model, transition*/) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);
    // reset to default tabs
    controller.set('activeTabDetails', 'contracts');
    controller.set('activeTabbuyer', 'contracts');
  },

  actions: {
    closeDetails() {
      this.transitionTo(
        'network.show.details',
        this.controllerFor('network.show.details').get('activeTab')
      );
    }
  }
});
