import Ember from 'ember';
import ENV from '../config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
  dbVersion: ENV.APP.dbVersion,
  ajax: Ember.inject.service(),

  setupController(controller) {
    controller.set('currentUser', this.get('session.session.content.authenticated.user'));
  },

  init() {
    this.setupLoader();
  },

  setupLoader() {
    this.controllerFor('loading').get('loaderWords').pushObject('network');
  },

});
