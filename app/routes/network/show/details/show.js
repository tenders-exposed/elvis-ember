import Ember from 'ember';

export default Ember.Route.extend({
  me: Ember.inject.service(),
  ajax: Ember.inject.service(),
  store: Ember.inject.service(),

  endpoints: {
    suppliers: 'suppliers',
    procurers: 'procuring_entities',
    relationships: ''
  },

  beforeModel(){
    let controller = this.controllerFor('network.show.details.show');
    controller.set('currentlyLoading', true);

    return this.modelFor('network.show');
  },

  model(params){
    this.controllerFor('network.show.details.show').set('params', params);

    let self = this;
    let networkModel = this.modelFor('network.show');
    let node = _.find(networkModel.data.graph.nodes, function(o) {
      return +o.id === +params.id;
    });

    let endpoint = this.paramsFor('network.show.details').tab;
    let endpointQ = this.endpoints[endpoint];

    let countries = networkModel.get('query').countries;
    let years     = networkModel.get('query').years;
    let token = this.get('me.data.authentication_token');
    let email = this.get('me.data.email');

    let firstYear = _.head(years);
    let lastYear = _.last(years);

    //@todo: query does not contain the years & countries
    let entityQuery = `{
        "query": {
          "${endpointQ}": [${params.id}]
        }
      }`;

    return this.get('ajax')
      .post('/contracts/' + this.endpoints[endpoint] + '_details', {
        data: entityQuery,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        (data)=>{
          let dataEntity = data.search.results[0];
          dataEntity.firstYear = firstYear;
          dataEntity.lastYear = lastYear;
          dataEntity.flags = node.flags;
          return dataEntity;

        },(response) => {

          self.get('notifications').clearAll();
          console.log(response);
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  afterModel(){
    let controller = this.controllerFor('network.show.details.show');
    controller.set('currentlyLoading', false);
  },

  setupController(controller, model) {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);

    let procurers = [];
    let ids = [];

    _.forEach(model.contracts, function(contract) {
      let id = contract.procuring_entity.x_slug_id;

      if(typeof procurers[id] === 'undefined'){
        procurers[id] = {};
        procurers[id].id = contract.procuring_entity.x_slug_id;
        procurers[id].name = contract.procuring_entity.name;
        procurers[id].contracts = [];
        procurers[id].income = 0;
        procurers[id].tenderers = [];
        procurers[id].median = 0;
        ids.push(id);
      }
      procurers[id].contracts.push(contract.award.title);
      procurers[id].income += contract.award.value.x_amount_eur;
      procurers[id].tenderers.push(contract.number_of_tenderers);

    });
    //avg bids
    _.forEach(ids, function (id) {
        let sorted = _.sortBy(procurers[id].tenderers);
        let length = sorted.length;
        if(length) {
          let poz = length/2;
          poz = _.floor(poz);
          let median = sorted[poz];
          //console.log("length ", length);
          //console.log("poz ", poz);
          //console.log("tenderers ", sorted);
          //console.log("median ", median);
          if(length%2 === 0) {
              median = (median + sorted[poz-1])/2;
              median = _.round(median,1);
              //console.log("median rest "+sorted[poz-1] + " median " + median);
          }
          procurers[id].median = median;
        }
    });
    model.procurers = procurers;
    controller.set('model', model);
  },

  actions: {
    closeDetails(){
      this.transitionTo(
        'network.show.details',
        this.controllerFor('network.show.details').get('activeTab')
      );
    }
  }
});
