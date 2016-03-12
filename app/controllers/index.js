import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  fakeUser: Ember.computed(function() {
    return {
      email: '',
      password: '',
      password_confirmation: ''
    }
  }),

  actions: {
    register() {
      let self = this;
      this.store.createRecord('user', {
          email: self.get('fakeUser.email'),
          password: self.get('fakeUser.password'),
          password_confirmation: self.get('fakeUser.password_confirmation')
        }).save().then(function() {
          self.notifications.addNotification({
            message: 'Done! Please check your inbox.',
            type: 'success'
          });
        self.transitionToRoute('index');
        }, function(response) {
          console.log(response);
          self.notifications.addNotification({
            message: 'Error!',
            type: 'error'
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
      this.get('session').authenticate('authenticator:elvis', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
