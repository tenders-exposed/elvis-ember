import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(...arguments);
  },
  actions: {
    closeLoading() {
      this.transitionTo('network.show.details',
      this.controllerFor('network.show.details').get('activeTab'));
    }
  }
});