import Ember from 'ember';
const { Route, inject } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),

  model(params, transition){
    let tab = transition.params['network.show.details'].tab;
    let contractId = params.contract_id;
    let entityId = params.node_id;
    let self = this;
    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');

    return this.get('ajax')
      .request(`/contracts/${contractId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        (data) => {
          let results = data.search.results[0];
          results.supplier = results.suppliers[0];
          results.entityId = entityId;
          //results.nodeType = tab;
          results.tab = tab;

          let details = {'yes' : 'check', 'no' : 'close', 'null' : 'question'};

          results.award.date.full = `${results.award.date.x_year}-${results.award.date.x_month}-${results.award.date.x_day}`;
          results.x_eu_project = String(results.x_eu_project);
          results.x_framework = String(results.x_framework);
          results.x_subcontracted = String(results.x_subcontracted);


          results.eu_project = details[results.x_project] ? details[results.x_project] : 'check' ;
          results.framework = details[results.x_framework]  ? details[results.x_framework] : 'check' ;
          results.subcontracted = details[results.x_subcontracted] ? details[results.x_subcontracted] : 'check' ;

          return results;
        }, (response) => {

          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
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
