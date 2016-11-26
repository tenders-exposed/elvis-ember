import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(){
    this.store.unloadAll('network');
  },
  activate() {
    this.notifications.clearAll();
  },

  setupController(controller, model) {

    controller.set('model', model);
    let self = this;
    controller.addObserver('network', function() {
      self.controllerFor('network.show.details').set(
        'gridOptions.suppliers.network',
        controller.get('network')
      );
      self.controllerFor('network.show.details').set(
        'gridOptions.procurers.network',
        controller.get('network')
      );
      self.controllerFor('network.show.details').set(
        'gridOptions.relationships.network',
        controller.get('network')
      );
      self.controllerFor('network.show.details').set(
        'network',
        controller.get('network')
      );
    });
  },

  actions: {
    openSidebar() {
      this.transitionTo('network.show.details');
    }
  }
});
