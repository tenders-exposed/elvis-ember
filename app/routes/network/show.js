import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  activate() {
    this.notifications.clearAll();
  },

  // beforeModel() {
  // },

  model(params) {
    return this.get('store').findRecord('network', params.network_id);
  },

  setupController(controller, model) {
    // console.log(`network ${model.id} should be`, model);
    controller.set('network', undefined);
    controller.set('model', model);
    controller.set('stabilizationPercent', 0);
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
