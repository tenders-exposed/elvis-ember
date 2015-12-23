import Ember from 'ember';

export default Ember.Controller.extend({
  user: Ember.computed(function() {
    return this.store.createRecord('user');
  }),
  actions: {
    register() {
      var self = this;
      this.get('user').save().then(function() {
        self.notifications.addNotification({
          message: 'Done! Please check your inbox.',
          type: 'success'
        });
        self.transitionToRoute('login');
      });
    },
  }
});
