import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  beforeModel() {
    this.store.unloadAll('network');
  },

  activate() {
    this.notifications.clearAll();
  },

  setupController(controller, model) {
    controller.set('model', model);
    console.log('graph', model.get('graph'));
    console.log('graph', model.get('query'));
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
