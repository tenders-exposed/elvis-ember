import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Page Not Found',
  setupController(controller, error) {
    controller.set('errors', error.payload.errors);
    this._super(...arguments);
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    controller.set('activeTab', activeTab);
    // reset to default tabs
    controller.set('activeTabDetails', 'contracts');
    controller.set('activeTabbuyer', 'contracts');
  },
  actions: {
    closeDetails() {
      this.transitionTo('network.show.details',
        this.controllerFor('network.show.details').get('activeTab'));
    }
  }
});
