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

  getFlags(indicators) {
    let flagsCount = 0;
    let flagsNames = [];
    _.each(indicators, function (indicator) {
      if(indicator.value == 0) {
        flagsCount++;
        flagsNames.push(indicator.type);
      }
    });

    return {flagsCount: flagsCount, flagsNames: flagsNames};
  },

  getContracts(apiAddressContracts, endpointQ, page) {

    let self = this;
    let options = {};
    options.headers = {
      'Content-Type': 'application/json'
    };
    // /networks/{networkID}/nodes/{nodeID}/bids?limit=10&page=1
    // console.log('get Contracts - apiAddressContracts', apiAddressContracts);
    return this.get('ajax')
      .request(`${apiAddressContracts}${page}`,{
        data: options
      })
      .then(
        (data) => {
          // console.log('getContracts-data', data);
          // console.log('getContracts-endpointQ', endpointQ);
          let pag = {
            page: data.page,
            totalPages: data.totalPages
          };
          if (endpointQ != 'relationships') {
            let contracts = [];
            _.each(data.bids, function(bid) {
              let flags = self.getFlags(bid.lot.tender.indicators);
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
                xAmountApproximated: bid.lot.tender.xAmountApproximated,
                flagsCount: flags.flagsCount,
                flagsNames: flags.flagsNames
              };
              // console.log('getContracts-contract', contract);
              contracts.push(contract);
            });
            //let contractsCount = dataEntity.winningBids.length;
            // console.log('getContracts-contracts', contracts);
            return {contracts: contracts, pag: pag};

          } else {
            let contracts = [];
            _.each(data.bids, function(bid) {
              let flags = self.getFlags(bid.lot.tender.indicators);
              let contract = {
                tenderId: bid.lot.tender.id,
                title: bid.lot.title ? `${bid.lot.tender.title} - ${bid.lot.title}` : bid.lot.tender.title,
                date: bid.lot.awardDecisionDate,
                bids: bid.lot.bidsCount,
                value: bid.value,
                year: bid.lot.tender.year,
                source: bid.lot.tender.sources[0],
                xYearApproximated: bid.lot.tender.xYearApproximated,
                xAmountApproximated: bid.lot.tender.xAmountApproximated,
                flagsCount: flags.flagsCount,
                flagsNames: flags.flagsNames
              };
              contracts.push(contract);
            });
            // let contractsCount = data.edge.winningBids.length;
            return {contracts: contracts, pag: pag};
          }
        });

  },

  // node = node or cluster
  // nodeId = node or node ids of cluster
  // endpoint = type of node
  // filterById in relationships = ids of the procuring entity to filter the contracts by
  getModelDetails(apiAddress, endpointQ/*, filterById*/) {

    let options = {};
    options.headers = {
      'Content-Type': 'application/json'
    };

    return this.get('ajax')
      .request(`${apiAddress}`,{
       data: options
      })
      .then(
        (data) => {
          let dataEntity = {};
          // extract the unique buyers / bidders for bidder / buyer
          if (endpointQ != 'relationships') {
            if (endpointQ == 'clusters') {
              Object.assign(dataEntity, data.cluster);

            } else {
              Object.assign(dataEntity, data.node);
              //mutat
              // this.titleToken = dataEntity.name;
            }

          } else {
            Object.assign(dataEntity, data.edge);
          }
          // console.log('dataEntity - after request', dataEntity);
          return dataEntity;

        });
  },

  getNodeDetails(nodeId, endpoint) {
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

    // for future retrive and process of contracts
    dataEntity.apiAddress = `/networks/${networkId}/${this.endpoints[endpointQ]}/${nodeId}`;
    dataEntity.apiAddressContracts = `${dataEntity.apiAddress}/bids?limit=5&page=`;

    dataEntity.endpointQ = endpointQ;

    return dataEntity;
  },

  model(params,transition) {

    let self = this;
    let controller =  this.get('controller');
    let { tab } = transition.params['network.show.details'];
    let endpoint  = this.paramsFor('network.show.details').tab;

    let dataEntity = this.getNodeDetails(params.id, endpoint);

    this.set('tab', tab);
    this.set('page', 1);
    controller.set('params', params);
    controller.set('tab', tab);
    controller.set('modelDetails', undefined);


    return this.controllerFor('network.show').get('networkDefer').then(() => {
      // console.log('start model');
      let details;
      // console.log('dataEntity',dataEntity);
      // bidder,buyers || relationships
      if (endpoint === 'relationships') {
          let edge = self.get('networkService').getEdgeById(params.id);
          details = Promise.all([
            self.getModelDetails(dataEntity.apiAddress, dataEntity.endpointQ),
            self.getContracts(dataEntity.apiAddressContracts, dataEntity.endpointQ,self.get('page'))
          ]).then(function (values) {
            dataEntity.fromLabel =  edge.fromLabel;
            dataEntity.toLabel =  edge.toLabel;
            Object.assign(dataEntity, values[0]);
            dataEntity.contracts = values[1].contracts;
            dataEntity.pag = values[1].pag;

            // console.log('model', dataEntity);
            controller.set('modelDetails', dataEntity);
            return values;
          });

        return details;

      } else {
        details = Promise.all([
          self.getModelDetails(dataEntity.apiAddress, dataEntity.endpointQ),
          self.getContracts(dataEntity.apiAddressContracts, dataEntity.endpointQ,self.get('page'))
        ]).then(function (values) {
          Object.assign(dataEntity, values[0]);
          //Object.assign(dataEntity, values[1]);
          dataEntity.contracts = values[1].contracts;
          dataEntity.pag = values[1].pag;

          // console.log('model - values0', values[0]);
          // console.log('model - values1', values[1]);
          // console.log('model - dataEntity', dataEntity);
          controller.set('modelDetails', dataEntity);
          return values;
        });
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
  getContractsPage() {
    let controller =  this.get('controller');
    let modelDetails = controller.get('modelDetails');
    let self = this;
    controller.set('loadingContracts', true);

    self.getContracts(modelDetails.apiAddressContracts, modelDetails.endpointQ,this.get('page'))
      .then(function(data) {
        controller.set('loadingContracts', false);
        controller.set('modelDetails.contracts', data.contracts);
        controller.set('modelDetails.pag', data.pag);
        return data;
      });
  },

  actions: {
    closeDetails() {
      this.transitionTo(
        'network.show.details',
        this.controllerFor('network.show.details').get('activeTab')
      );
    },
    page(pageAction) {
      // console.log('details.show- action.page', pageAction);
      let controller =  this.get('controller');
      let modelDetails = controller.get('modelDetails');
      let self = this;
      controller.set('loadingContracts', true);

      if (pageAction == 'next') {
        this.set('page', this.get('page') + 1);
        this.getContractsPage();
      }
      if (pageAction == 'back') {
        this.set('page', this.get('page') - 1);
        this.getContractsPage();
      }
      if (pageAction == 'first') {
        this.set('page', 1);
        this.getContractsPage();
      }
      if (pageAction == 'last') {
        this.set('page', controller.get('modelDetails.pag.totalPages'));
        this.getContractsPage();
      }
    }
  }
});
