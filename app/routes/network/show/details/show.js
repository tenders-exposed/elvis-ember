import Ember from 'ember';

const { Route, inject } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),

  endpoints: {
    suppliers: 'suppliers',
    procurers: 'procuring_entities',
    relationships: ''
  },

  beforeModel() {
    return this.modelFor('network.show');
  },

  model(params) {
    this.controllerFor('network.show.details.show').set('params', params);

    let self = this;
    let networkModel = this.modelFor('network.show');
    let node = _.find(networkModel.data.graph.nodes, (o) => {
      return +o.id === +params.id;
    });

    let endpoint  = this.paramsFor('network.show.details').tab;
    let endpointQ = this.endpoints[endpoint];

    let { years } = networkModel.get('query');
    let { countries } = networkModel.get('query');
    let { cpvs } = networkModel.get('query');
    // console.log('cpvs-show',cpvs);
    // console.log('years-show',years);
    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');

    let firstYear = _.head(years);
    let lastYear = _.last(years);

    // @TODO: query does not contain the years & countries
    let entityQuery = `{
        "query": {
          "${endpointQ}": [${params.id}],
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
          let [ dataEntity ] = data.search.results;
          dataEntity.firstYear = firstYear;
          dataEntity.lastYear = lastYear;
          dataEntity.flags = node.flags;
          this.titleToken = dataEntity.name;
          return dataEntity;

        }, (response) => {

          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  setupController(controller, model, transition) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');

    controller.set('activeTab', activeTab);
    //reset to default tabs
    controller.set('activeTabDetails', 'contracts');
    controller.set('activeTabProcurer', 'contracts');

    let { tab } = transition.params['network.show.details'];
    let ids = [];
    let nodes = {};

    if (tab === 'procurers') {
      _.forEach(model.contracts, (contract) => {
        _.forEach(contract.suppliers, (supplier) => {
          let idSup = `id_${supplier.x_slug_id}`;
          if (typeof nodes[idSup] === 'undefined') {
            ids.push(idSup);
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
    controller.set('model', model);
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
