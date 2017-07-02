import Ember from 'ember';

const { Route, observer, inject, computed } = Ember;

export default Route.extend({
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),
  networkService: inject.service(),

  endpoints: {
    suppliers: 'suppliers',
    procurers: 'procuring_entities',
    relationships: ''
  },
  controller:computed(function () {
    return this.controllerFor('network.show.details.show');
  }),

  // get the suppliers/ procurers based on contracts
  processContracts( model, endpoint){
    let ids = [];
    let nodes = {};

    //if is a procurer
    if (endpoint === 'procurers') {
      _.forEach(model.contracts, (contract) => {
        _.forEach(contract.suppliers, (supplier) => {
          let idSup = `id_${supplier.x_slug_id}`;
          if (typeof nodes[idSup] === 'undefined') {
            ids.push(idSup);
            // agregare if idSup is part of a cluster
            nodes[idSup] = {
              name: supplier.name,
              id: supplier.x_slug_id,
              contracts: [],
              contractsCount: 0,
              income: 0,
              tenderers: [],
              median: 0,
              nodeType: 'supplier'
            };
          }
          if (contract.award.title) {
            nodes[idSup].contracts.push({ 'id': contract.id, 'name': contract.award.title });
            nodes[idSup].contractsCount += 1;
          }
          nodes[idSup].income += contract.award.value.x_amount_eur;
          nodes[idSup].tenderers.push(contract.number_of_tenderers);
        });
      });

    } else {
      // if we are in a supplier
      _.forEach(model.contracts, (contract) => {
        let idSup = `id_${contract.procuring_entity.x_slug_id}`;
        if (typeof nodes[idSup] === 'undefined') {
          ids.push(idSup);
          nodes[idSup] = {
            id: contract.procuring_entity.x_slug_id,
            name: contract.procuring_entity.name,
            contracts: [],
            contractsCount: 0,
            income: 0,
            tenderers: [],
            median: 0,
            nodeType: 'procurer'
          };
        }
        if (contract.award.title) {
          nodes[idSup].contracts.push({ 'id': contract.id, 'name': contract.award.title });
          nodes[idSup].contractsCount += 1;
        }
        nodes[idSup].income += contract.award.value.x_amount_eur;
        nodes[idSup].tenderers.push(contract.number_of_tenderers);
      });
    }
    // avg bids
    _.forEach(ids, (idNode) => {
      let sorted = _.sortBy(nodes[idNode].tenderers);
      let { length } = sorted;
      if (length) {
        let poz = length / 2;
        poz = _.floor(poz);
        let median = sorted[poz];
        if (length % 2 === 0) {
          median = (median + sorted[poz - 1]) / 2;
          median = _.round(median, 1);
        }
        nodes[idNode].median = median;
      }
    });

    // transform it into an array
    model.nodes = _.values(nodes);
    model.nodesCount = model.nodes.length;
    return model

  },
  // node = node or cluster
  // nodeId = node or node ids of cluster
  // endpoint = type of node
  // filterById in relationships = ids of the procuring entity to filter the contracts by
  getModelDetails(node, nodeIds, endpoint, filterById){
    let self = this;
    let networkModel = this.modelFor('network.show');
    let { years } = networkModel.get('query');
    let { countries } = networkModel.get('query');
    let { cpvs } = networkModel.get('query');
    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');
    let firstYear = _.head(years);
    let lastYear = _.last(years);

    let endpointQ = this.endpoints[endpoint];

    // params from nodeIds
    let entityQuery = `{
        "query": {
          "${endpointQ}": [${nodeIds}],
          "years": [${years}],
          "countries": ["${countries}"],
          "cpvs": ["${cpvs}"]
        }
      }`;

    return this.get('ajax')
      .post(`/contracts/${this.endpoints[endpoint]}_details`, {
        data: entityQuery,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        (data) => {
          let dataEntity;
          let filterCotracts = function (contracts, filterById) {
            return  _.filter(contracts, (contract) => {
              let check = _.indexOf(filterById, String(contract.procuring_entity.x_slug_id));
              if(check === -1 ) {
                return false;
              } else {}
              return true;
            });
          };

          if(data.search.count > 1) {
            // multiple ids of nodes requested, merge them in a single unit
            dataEntity = {'contracts': [], 'median_tenderers': 0, 'missing_values': 0, 'total_earnings': 0};
            _.forEach(data.search.results, function (resultNode) {
              // filterContracts if requested
              if(filterById) {
                resultNode.contracts = filterCotracts(resultNode.contracts, filterById);
              }
              dataEntity.contracts.pushObjects(resultNode.contracts);
              dataEntity.median_tenderers += resultNode.median_tenderers;
              dataEntity.missing_values += resultNode.missing_values;
              dataEntity.total_earnings += resultNode.total_earnings;
            });
          } else {
            [ dataEntity ] = data.search.results;
            if(filterById) {
              dataEntity.contracts = filterCotracts(dataEntity.contracts, filterById);
            }
          }

          dataEntity.firstYear = firstYear;
          dataEntity.lastYear = lastYear;
          dataEntity.flags = node.flags;
          dataEntity.name = node.label;
          dataEntity.contractsCount = dataEntity.contracts.length;
          dataEntity.queryIds = nodeIds;
          // only if we are not in a relationship
          // relationships do not requier the suppliers/ procurers
          if(!filterById) {
            dataEntity = self.processContracts(dataEntity, endpoint);
          }
          this.titleToken = dataEntity.name;

          // console.log('dataEntity', dataEntity);
          return dataEntity;

        }, (response) => {
          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  setNodeDetails(nodeId, endpoint, filterContracts){
    let node =  this.get('networkService').getNodeById(nodeId);
    let requestedIds = [nodeId];

    // if it is a cluster get the ids of nodes in that cluster
    if(this.get('networkService').get('network.network').clustering.isCluster(nodeId)){
      // get the nodes in that cluster
      let clusterDetails = _.find(this.get('networkService.clusters'),(o) => {
        return o.id == nodeId;
      });
      requestedIds = clusterDetails.nodesId;
    }
    return this.getModelDetails(node, requestedIds, endpoint, filterContracts);
  },

  setModelDetails() {
    let controller =  this.get('controller');
    let params =  controller.get('params');
    let endpoint  = this.paramsFor('network.show.details').tab;

    if(endpoint === 'relationships') {
      let [from,to] = _.split(params.id, '-');
      let fromId = [from];

      // find node
      let fromNode = this.get('networkService').getNodeById(from);

      // determine if from is node or cluster
      if(this.get('networkService').get('network.network').clustering.isCluster(from)){
        let clusterDetails = _.find(this.get('networkService.clusters'),(o) => {
          return o.id == from;
        });
        fromId = clusterDetails.nodesId;
      }

      // & filterContracts by queryIds, by the procurer id or ids ( if cluster)
      this.setNodeDetails(to, 'suppliers', fromId).then((dataTo) => {
        controller.set('modelDetails', {'from': {'name': fromNode.label}, 'to': dataTo});
        controller.set('readyToRender',true);

        // console.log('modelDetails', controller.get('modelDetails'));
      }).catch((error) => {
        console.error('error', error);

      });

    } else {
      // for a single node
      this.setNodeDetails(params.id, endpoint, false).then((data) => {
        controller.set('modelDetails', data);
        controller.set('readyToRender',true);
      });
    }
  },
  networkLoaded: observer('networkService.isReady', function () {
    // if the network service is Ready and the data is not yet set
    if(this.get('networkService.isReady')
      && ! this.get('controller').get('readyToRender')
    ) {
      this.setModelDetails();
    }
  }),

  model(params,transition) {
    this.get('controller').set('params', params);
    let { tab } = transition.params['network.show.details'];
    this.set('tab', tab);
    this.get('controller').set('tab', tab);

    if(this.get('networkService.isReady')) {
      this.get('controller').set('modelDetails', undefined);
      this.get('controller').set('readyToRender',false);
      this.setModelDetails();
    }
  },

  setupController(controller, model, transition) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);
    // reset to default tabs
    controller.set('activeTabDetails', 'contracts');
    controller.set('activeTabProcurer', 'contracts');
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
