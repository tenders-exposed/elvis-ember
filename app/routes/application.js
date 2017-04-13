import Ember from 'ember';
import ENV from '../config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { Route, inject } = Ember;
const { APP } = ENV;

export default Route.extend(ApplicationRouteMixin, {
  host: APP.apiHost,
  namespace: APP.apiNamespace,
  dbVersion: APP.dbVersion,
  ajax: inject.service(),
  session: inject.service(),
  me: inject.service(),

  model() {
    if (this.get('session.isAuthenticated')) {
      return this.store.findRecord('user', this.get('me.data.id'));
    } else {
      return undefined;
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
  },

  init() {
    this.setupLoader();
  },

  setupLoader() {
    this.controllerFor('loading').get('loaderWords').pushObject('network');
  },

  actions: {
    // resetting the toggled menu for all routes
    didTransition() {
      this.controllerFor('application').set('dropMenu', false);
      this.controllerFor('application').set('footer', 'partials/main-footer');
    }
  }
});
