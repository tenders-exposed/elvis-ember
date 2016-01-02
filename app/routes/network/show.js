import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    openSidebar() {
      this.transitionTo('network.show.details');
    }
  }
});
