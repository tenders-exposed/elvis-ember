import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  fakeUser: {
    email: '',
    password: '',
    password_confirmation: ''
  },
  actions: {
    register() {
      let self = this;
      let user = this.store.createRecord('user', {
        email: self.get('fakeUser.email'),
        password: self.get('fakeUser.password'),
        password_confirmation: self.get('fakeUser.password_confirmation')
      });

      return user.save().then(() => {
        self.notifications.clearAll();
        self.notifications.success('Done! Please check your inbox.', {
          autoClear: true
        });
        self.transitionToRoute('welcome');
      },
      (response) => {
        self.notifications.clearAll();
        _.forEach(response.errors, (error, index) => {
          error.forEach((v) => {
            self.notifications.error(`Error: ${index } ${v}!`);
          });
        });
      });
    },
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session').authenticate('authenticator:elvis', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then((response) => {
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
