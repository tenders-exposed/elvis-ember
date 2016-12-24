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
