import ESASession from "ember-simple-auth/services/session";

export default ESASession.extend({

  store: Ember.inject.service(),

  setCurrentUser: function() {
    if (this.get('isAuthenticated')) {
      this.get('store').queryRecord('user', '56f6c8dbd731e25711000000').then((user) => {
        this.set('currentUser', user);
      });
    }
  }.observes('isAuthenticated')

});
