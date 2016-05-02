import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  fakeUser: Ember.computed(function() {
    return {
      email: '',
      password: '',
      password_confirmation: ''
    };
  }),

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
