import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    this.notifications.clearAll();
  },

  model(params) {
    // alert('finding model');
    return this.store.findRecord('network', params.id);
  },

  setupController(controller, model) {
    // alert('found model');
    controller.set('model', model);
    // alert('set model');
  },

  actions: {
    openSidebar() {
      this.transitionTo('network.show.details');
    }
  }
});
