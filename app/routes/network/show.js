import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
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
