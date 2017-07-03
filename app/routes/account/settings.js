import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, inject, Logger } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  classNames: ['body-page'],
  titleToken: 'Account settings',
  ajax: inject.service(),

  actions: {
    settings(model) {
      // @TODO: implement save model
      Logger.info('model', model);
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
          self.get('notifications').clearAll();
          self.get('notifications').success('Done! Your password was reset.', {
            autoClear: true
          });

          this.controller.set('current_password', '');
          this.controller.set('password', '');
          this.controller.set('password_confirmation', '');

        }, (response) => {
          self.get('notifications').clearAll();
          Logger.info(response);
          // @TODO: Do something with the below code (and errors)
          /* _.forEach(response.errors, (error, index) => {
            error.forEach((v) => {
              self.get('notifications').error(`Error: ${index } ${v}`);
            });
          });*/
        });
    }
  },

  activate() {
    this.get('notifications').clearAll();
    this.get('notifications').warning('Warning, this page contains unfinished features!', {
      autoClear: true,
      clearDuration: 10000
    });
  }
});
