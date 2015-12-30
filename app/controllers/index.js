import Ember from 'ember';

export default Ember.Controller.extend({
  user: Ember.computed(function() {
    return this.store.createRecord('user');
  }),

  actions: {
    register() {
      let self = this;
      this.get('user').save().then(function() {
        self.notifications.addNotification({
          message: 'Done! Please check your inbox.',
          type: 'success'
        });
        self.transitionToRoute('index');
      }, function(response) {
          console.error('There was a problem', response);
          Object.keys(response.errors).map(function(value, index) {
            console.log(index);
            response.errors.each(function() {
              self.notifications.addNotification({
                message: this[0],
                type: 'error',
                autoClear: true,
                clearDuration: 2500
              });
            });
          });
        }
      );
    }
  }
});
