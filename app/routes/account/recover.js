import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  actions: {
    deviseSendChange(password, password_confirmation, token) {

      let data = `{"user": {
                    "reset_password_token": "${token}",
                    "password": "${password}",
                    "password_confirmation": "${password_confirmation}"}
                  }`;
      let headers = {
        'Content-Type': 'application/json'
      };
      this.get('ajax').put('users/password', {
        data,
        headers
      }).then(() => {
        this.notifications.addNotification({
          message: 'Your password was updated!',
          type: 'success'
        });
        this.controller.transitionToRoute('welcome');
      }, (response) => {
        // @TODO: show error messages from server
        console.log(response);
      });
    },

    deviseSendRecover(email) {
      this.notifications.clearAll();
      this.controller.validate().then(() => {
        let data = `{ "user": { "email": "${email}" } }`;
        let headers = {
          'Content-Type': 'application/json'
        };
        this.get('ajax').post('users/password', {
          data,
          headers
        }).then((response) => {
          console.log(response);
          this.controller.set('emailSent', true);

        }, (response) => {
          // @TODO: show error messages from server
          console.log(response);
        });
      }, (response) => {
        let [error] = response.email;
        this.notifications.error(`Error: ${error}`);
      });
    }
  }
});
