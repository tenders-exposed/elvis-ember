import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    closeLoading() {
      console.log('this is loading');
      this.transitionTo('network.show.details',
      this.controllerFor('network.show.details').get('activeTab'));
    }
  }
});