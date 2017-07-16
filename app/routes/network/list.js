import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, inject } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  me: inject.service(),
  ajax: inject.service(),
  classNames: ['body-page'],

  model() {
    let networks = this.get('store').findAll('network');
    return networks;
  },

  afterModel(model) {
    this.titleToken = ` My projects (${model.get('length')})`;

    return model.map(function(network) {
      if (network.get('description') === 'null') {
        network.set('description', '');
      }
      network.set('firstYear', _.first(network.get('query.years')));
      network.set('lastYear', _.last(network.get('query.years')));
      network.set('cpvsCount', network.get('query.cpvs').length);
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
  },
  actions: {
    deleteNetwork(networkId) {
      let self = this;
      if (this.get('session.isAuthenticated')) {
        this.get('store').findRecord('network', networkId, { backgroundReload: false }).then(function(network) {
          network.deleteRecord();
          if (network.get('isDeleted')) {
            self.get('notifications').clearAll();
            self.get('notifications').success('Done! The network was deleted.', { autoClear: true });
            network.save(); // => DELETE to /posts/1
          } else {
            self.get('notifications').error(`Error: Please login to delete the network!`);
          }
        });
      }
    }
  }
});
