import Route from '@ember/routing/route';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import moment from 'moment';
import { computed, observer } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  me: service(),
  ajax: service(),
  classNames: ['body-page'],

  model() {
    let networks = this.get('store').findAll('network');
    return networks;
  },

  afterModel(model) {
    console.log('list aftermodel');
    this.titleToken = ` My projects (${model.get('length')})`;

    console.log('list aftermodel - get length');

    return model.map(function(network) {
      console.log('list aftermodel - map networks');

      if (network.get('synopsis') === 'null') {
        network.set('synopsis', '');
      }

      let companies = 0;
      if (typeof network.get('bidders') !== 'undefined') {
        companies += network.get('bidders').length;
      }
      if (typeof network.get('query.buyers') !== 'undefined') {
        companies += network.get('query.buyers').length;
      }
      network.set('companies', companies);

      network.set('firstYear', _.first(network.get('query.years')));
      network.set('lastYear', _.last(network.get('query.years')));
      let cpvs = network.get('query.cpvs', []);
      if(cpvs) {
        network.set('cpvsCount', cpvs.length);
      } else {
        network.set('cpvsCount', 0);
      }

      network.set('nodeCount', network.get('count.nodeCount'));
      network.set('edgeCount', network.get('count.edgeCount'));

      network.set('updated', moment.parseZone(network.get('updated')).local().format());
      console.log('end afterModel');
      return network;
    }, model);


  },

  setupController(controller, model) {
    this._super(controller, model);
    console.log('setupController - list', model);
    controller.set('model',model);
  },

  activate() {
    console.log('list- activate');
    this.notifications.clearAll();
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
