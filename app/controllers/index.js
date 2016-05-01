import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  fakeUser: Ember.computed(function() {
    return {
      email: '',
      password: '',
      password_confirmation: ''
    };
  }),

  beforeModel() {
    this.set('currentUser.email', this.get('session.content.authenticated.user.email'))
  },

  actions: {
    register() {
      let self = this;
      this.store.createRecord('user', {
          email: self.get('fakeUser.email'),
          password: self.get('fakeUser.password'),
          password_confirmation: self.get('fakeUser.password_confirmation')
        }).save().then(function(response) {
          self.notifications.clearAll();
          self.notifications.success('Done! Please check your inbox.', {
              autoClear: true
          });
        self.transitionToRoute('index');
        }, function(response) {
          response.errors.forEach((error) => {
            self.notifications.error(`Error: ${error.source.pointer.replace('/data/attributes/', '')} ${error.detail}`);
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
      let {identification, password} = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:devise', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
