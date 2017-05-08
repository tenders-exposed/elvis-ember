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

  setupController(controller, model) {
    this._super(controller, model);

    let token     = this.get('me.data.authentication_token');
    let email     = this.get('me.data.email');
    let networkId = '58b3291a2dcb561384000003';

    this.get('ajax').request(`/networks/${networkId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': `${email}`,
        'X-User-Token': `${token}`
      }
    }).then((data) => {
      let { network } = data;

      network.firstYear = _.first(network.query.years);
      network.lastYear = _.last(network.query.years);
      network.cpvsCount = network.query.cpvs.length;
      controller.set('demoNetwork', network);
      return data;
    });
  },
  activate() {
    this.notifications.clearAll();
    this.notifications.warning('Warning, this page contains unfinished features!', {
      autoClear: true,
      clearDuration: 10000
    });
  }
});
