import Ember from 'ember';
const { Route, inject } = Ember;

export default Route.extend({
  me: inject.service(),
  ajax: inject.service(),
  store: inject.service(),

  model(params){
    let self = this;
    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');

    console.log(`params-id ${params.id}`);

    return this.get('ajax')
      .request(`/contracts/${params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        (data) => {
          console.log("results", data.search.results[0]);
         return data.search.results[0];
        }, (response) => {

          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });

  }
});
