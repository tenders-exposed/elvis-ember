import Ember from 'ember';
import ENV from '../config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
  dbVersion: ENV.APP.dbVersion,
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),
  me: Ember.inject.service(),

  model() {
    if (this.get('session.isAuthenticated')) {
      return this.store.findRecord('user', this.get('me.data.id'));
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
  }

});
