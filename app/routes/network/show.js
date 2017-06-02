import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  activate() {
    this.notifications.clearAll();
  },

  model(params) {
    return this.get('store').findRecord(
      'network',
      params.network_id,
      { reload: true }
    );
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('stabilizationPercent', 0);
  },

  resetController(controller) {
    controller.set('network', undefined);
  },

  actions: {
    openSidebar() {
      let activeTab = this.controllerFor('network.show.details').get('activeTab');
      this.transitionTo('network.show.details', activeTab);
    },
    // set toggled menu for show routes and subroutes
    didTransition() {
      this.controllerFor('application').set('dropMenu', 'hideMenu');
      this.controllerFor('application').set('footer', false);
    }
  }
});
