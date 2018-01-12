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
      })
        .catch((reason) => {
          this.set('errors', reason);
        });
      // (response) => {
      //   self.notifications.clearAll();
      //   _.forEach(response.errors, (error, index) => {
      //     error.forEach((v) => {
      //       self.notifications.error(`Error: ${index } ${v}!`);
      //     });
      //   });
      // });
    }
  }
});
