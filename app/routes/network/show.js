import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  nodes() {
    return new Ember.vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);
  },
  edges() {
    return new Ember.vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]);
  },
  setupController(controller) {
    controller.set('nodes', this.nodes());
    controller.set('edges', this.edges());
  },
  actions: {
    openSidebar() {
      this.transitionTo('network.show.details');
    }
  }
});
