import Ember from 'ember';

export default Ember.Controller.extend({
  fakeUser: Ember.computed(function() {
    return {
      email: '',
      password: '',
      password_confirmation: ''
    };
  }),
  actions: {
    register() {
      let self = this;
      return this.store.createRecord('account.js', {
        email: self.get('fakeUser.email'),
        password: self.get('fakeUser.password'),
        password_confirmation: self.get('fakeUser.password_confirmation')
      }).save().then(function(response) {
          self.notifications.clearAll();
          self.notifications.success('Done! Please check your inbox.', {
            autoClear: true
          });
          console.log('Response: ', response);
          self.transitionToRoute('welcome');
        },
        function(response) {
          self.notifications.clearAll();
          _.forEach(response.errors, (error, index) => {
            error.forEach((v) => {
              self.notifications.error(`Error: ${index } ${v}`);
            });
            // JSON API version:
            // self.notifications.error(`Error: ${error.source.pointer.replace('/data/attributes/', '')} ${error.detail}`);
          });

          // Disabled for now, as we don't have JSON API error responses yet

          // console.error('There was a problem', response);
          // Object.keys(response.errors).map(function(value, index) {
          //   console.log(index);
          //   response.errors.each(function() {
          //     self.notifications.addNotification({
          //       message: this[0],
          //       type: 'error',
          //       autoClear: true,
          //       clearDuration: 2500
          //     });
          //   });
          // });
        }
      );
    },
    authenticate() {
      const { identification, password } = this.getProperties('identification', 'password');
      return this.get('session').authenticate('authenticator:elvis', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(function(response) {
        if (typeof response === 'undefined') {
          return;
        } else {
          return;
          // location.reload();
        }
      });
    }
  }
});
