import Ember from 'ember';
import ENV from '../config/environment';
import localforage from 'ember-local-forage';
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

  refreshData(name, path, controller) {
    let self = this;
    localforage.removeItem(name, function() {
      self.get('ajax').post(path).then((data) => {
        localforage.setItem(name, data.search.results).then(() => {
          localforage.getItem(name).then((result) => {
            controller.set(name, result);
          });
        });
      });
    });
  },
  refreshAllData(controller) {
    this.refreshData('countries', '/contracts/countries', controller);
    this.refreshData('cpvs', '/contracts/cpvs', controller);
  }
});
