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
    self.controllerFor('network.show.details').set(
      'fields.suppliers.value',
      _.capitalize(model.get('options.nodes'))
    );
    self.controllerFor('network.show.details').set(
      'fields.relationships.value',
      _.capitalize(model.get('options.edges'))
    );

    controller.addObserver('network', function() {
      //@todo: dead code
      let network = controller.get('network');
      self.controllerFor('network.show.details').set(
        'gridOptions.suppliers.network', network );
      self.controllerFor('network.show.details').set(
        'gridOptions.procurers.network',network);

      self.controllerFor('network.show.details').set(
        'gridOptions.relationships.network',network);
      //dead code?

      self.controllerFor('network.show.details').set(
        'network',
        controller.get('network')
      );
    });
  },

  actions: {
    openSidebar() {
      let activeTab = this.controllerFor('network.show.details').get('activeTab');
      this.transitionTo('network.show.details', activeTab);
    },
    //set toggled menu for show routes and subroutes
    didTransition(){
      this.controllerFor('application').set('dropMenu', 'hideMenu');
      this.controllerFor('application').set('footer', false);
    }
  }
});
