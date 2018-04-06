import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    register() {
      let self = this;
      return this.get('model').save().then(() => {
        self.notifications.clearAll();
        self.notifications.success('Done! Please check your inbox.', {
          autoClear: true
        });
        self.transitionToRoute('welcome');
      }).catch((response) => {
        this.set('errors', response);
        _.each(response.errors, function(error) {
          self.notifications.error(`${error.message}`, {
            autoClear: false
          });
        });
      });
    }
  }
});
