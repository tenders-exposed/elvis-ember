import Ember from 'ember';

const { Route, inject } = Ember;

export default Route.extend({
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),

  endpoints: {
    suppliers: 'suppliers',
    procurers: 'procuring_entities',
    relationships: ''
  },

  beforeModel() {
    let controller = this.controllerFor('network.show.details.show');
    controller.set('currentlyLoading', true);
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
    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');

    let firstYear = _.head(years);
    let lastYear = _.last(years);

    // @TODO: query does not contain the years & countries
    let entityQuery = `{
        "query": {
          "${endpointQ}": [${params.id}]
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
          return dataEntity;

        }, (response) => {

          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  afterModel() {
    let controller = this.controllerFor('network.show.details.show');
    controller.set('currentlyLoading', false);
  },

  setupController(controller, model,transition) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);

    let tab = transition.params["network.show.details"].tab;
    let nodeModel = {id: 0, name: '', contracts: [], income: 0, tenderers: [], median: 0, nodeType:'procurer'};
    let ids = [];
    let nodes = {};

    if(tab == 'procurers'){

      nodeModel.nodeType = 'supplier';
      _.forEach(model.contracts, (contract) => {
        _.forEach(contract.suppliers, (supplier) => {
           let id = supplier.x_slug_id;
           if(typeof nodes[id] === 'undefined'){
             nodes[id] = nodeModel;
             nodes[id].id = id;
             nodes[id].name = supplier.name;
             ids.push(id);
           }
           if(contract.award.title){
             nodes[id].contracts.push(contract.award.title);
           }
            nodes[id].income += contract.award.value.x_amount_eur;
            nodes[id].tenderers.push(contract.number_of_tenderers);
        });
      });
    } else {
      console.log("supplier details");
      _.forEach(model.contracts, (contract) => {
        let id = contract.procuring_entity.x_slug_id;
        if (typeof nodes[id] === 'undefined') {
          nodes[id] = nodeModel;
          nodes[id].id = id;
          nodes[id].name = contract.procuring_entity.name;
          ids.push(id);
        }
        if(contract.award.title){
          nodes[id].contracts.push(contract.award.title);
        }
        nodes[id].income += contract.award.value.x_amount_eur;
        nodes[id].tenderers.push(contract.number_of_tenderers);

      });
    }
    // avg bids
    _.forEach(ids, (id) => {
        let sorted = _.sortBy(nodes[id].tenderers);
        let { length } = sorted;
        if (length) {
          let poz = length / 2;
          poz = _.floor(poz);
          let median = sorted[poz];
          if (length % 2 === 0) {
            median = (median + sorted[poz - 1]) / 2;
            median = _.round(median, 1);
          }
          nodes[id].median = median;
        }
      });

    //transform it into an array
    let nodesArray= [];
    _.forEach(nodes,(node) => {
      console.log(node);
      nodesArray.push(node);
    });
    model.nodes = nodesArray;
    console.log('nodes',model.nodes);
    console.log('contracts',model.contracts);
    controller.set('model', model);
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
