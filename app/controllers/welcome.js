import Ember from 'ember';

export default Ember.Controller.extend({
  fakeUser: {
      email: '',
      password: '',
      password_confirmation: ''
  },
  actions: {
    register() {
      let self = this;
      let user =  this.store.createRecord('user', {
        email: self.get('fakeUser.email'),
        password: self.get('fakeUser.password'),
        password_confirmation: self.get('fakeUser.password_confirmation')
      });
      user.save().then(function(response) {
          self.notifications.clearAll();
          self.notifications.success('Done! Please check your inbox.', {
            autoClear: true
          });
          console.log('Response: ', response);
          self.transitionToRoute('welcome');
        },
        function(response) {
          console.log("errors");
          console.log(user.get('errors')); // instance of DS.Errors
          console.log(user.get('errors').toArray());
          console.log(user.get('isValid')); // false

          console.log("erori-register", response);
          self.notifications.clearAll();
        }
      );
    },
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session').authenticate('authenticator:elvis', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(function(response) {
        location.reload();
        if (typeof response === 'undefined') {
          return;
        } else {
          return;
        }
      });
    }
  }
});
