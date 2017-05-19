import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, inject } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  me: inject.service(),
  ajax: inject.service(),

  model() {
    let networks = this.get('store').findAll('network');
    return networks;
  },

  afterModel(model) {
    return model.map(function(network) {
      if(network.get('description') === 'null') {
        network.set('description','');
      }
      network.firstYear = _.first(network.get('query.years'));
      network.lastYear = _.last(network.get('query.years'));
      network.cpvsCount = network.get('query.cpvs').length;
      return network;
    }, model);

  },

  setupController(controller, model) {
    this._super(controller, model);
  },
  activate() {
    this.notifications.clearAll();
    this.notifications.warning('Warning, this page contains unfinished features!', {
      autoClear: true,
      clearDuration: 10000
    });
  }
});
