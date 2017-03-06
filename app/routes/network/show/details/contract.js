import Ember from 'ember';
const { Route, inject } = Ember;

export default Route.extend({
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),

  model(params){
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

          let details = {"yes" : "check", "no" : "close", "null" : "question"};
          let dateHash = {
            "1": "Jan",
            "2": "Feb",
            "3": "Mar",
            "4": "Apr",
            "5": "May",
            "6": "Jun",
            "7": "Jul",
            "8": "Aug",
            "9": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec"
          };

          results.award.date.x_month = dateHash[results.award.date.x_month];
          console.log("month", results.award.date.x_month);
          results.x_eu_project = String(results.x_eu_project);
          results.x_framework = String(results.x_framework);
          results.x_subcontracted = String(results.x_subcontracted);


          results.eu_project = details[results.x_project] ? details[results.x_project] : "check" ;
          results.framework = details[results.x_framework]  ? details[results.x_framework] : "check" ;
          results.subcontracted = details[results.x_subcontracted] ? details[results.x_subcontracted] : "check" ;

          console.log("results", results);
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
