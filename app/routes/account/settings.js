import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  actions: {
    settings(model) {
      // @todo: implement save model
      console.log('model', model);
    },
    deviseSendReset(current_password, password, password_confirmation) {
      let self = this;
      let email = this.controller.get('model.email');
      let token = this.controller.get('model.token');
      let data =  `{"user": {"email": "${email}", "current_password": "${current_password}", "password": "${password}", "password_confirmation": "${password_confirmation}"}}`;
      this.get('ajax').put('/users', {
        data,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        () => {
          self.notifications.clearAll();
          self.notifications.success('Done! Your password was reset.', {
            autoClear: true
          });

          this.controller.set('current_password', '');
          this.controller.set('password', '');
          this.controller.set('password_confirmation', '');

        }, (response) => {
          self.notifications.clearAll();
          console.log(response);
          /* _.forEach(response.errors, (error, index) => {
            error.forEach((v) => {
              self.notifications.error(`Error: ${index } ${v}`);
            });
          });*/
        });
    }
  },

  activate() {
    this.notifications.clearAll();
    this.notifications.warning('Warning, this page contains unfinished features!', {
      autoClear: true,
      clearDuration: 10000
    });
  }
});
