import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  activate() {
    // console.log('query: ', this.controllerFor('network.query').get('query'));
    this.notifications.clearAll();
  },

  // setupController(controller) {
  //   //controller.set('nodes', new vis.DataSet([
  //   //                          {id: 1, label: 'Node 1'},
  //   //                          {id: 2, label: 'Node 2'},
  //   //                          {id: 3, label: 'Node 3'},
  //   //                          {id: 4, label: 'Node 4'},
  //   //                          {id: 5, label: 'Node 5'}
  //   //                        ]));
  //   //controller.set('edges', new vis.DataSet([
  //   //                          {from: 1, to: 3},
  //   //                          {from: 1, to: 2},
  //   //                          {from: 2, to: 4},
  //   //                          {from: 2, to: 5}
  //   //                        ]));
  // },
  model(params) {
    return this.store.findRecord('network', params.id);
  },
  setupController(controller, model) {
    controller.set('model', model);
  },
  actions: {
    openSidebar() {
      this.transitionTo('network.show.details');
    }
  }
});
