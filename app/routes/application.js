import Ember from 'ember';
import ENV from '../config/environment';
import localforage from 'ember-local-forage';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
  dbVersion: ENV.APP.dbVersion,
  ajax: Ember.inject.service(),
  refreshData(name, path, controller) {
    let self = this;
    localforage.removeItem(name, function(err) {
      self.get('ajax').request(path)
        .then((data) => {
          localforage.setItem(name, data.search.results).then((results) => {
            localforage.getItem(name).then((result) => {
              controller.set(name, result);
            });
          });
          // data.forEach((k,v) => {
          //   localforage.setItem(name, data.search.results).then((results) => {
          //   });
          // });
        });
    });
  },
  refreshAllData(controller) {
    this.refreshData('countries', `${this.host}/api/${this.namespace}/contracts/countries`, controller);
    this.refreshData('cpvs', `${this.host}/api/${this.namespace}/contracts/cpvs/autocomplete`, controller);
  },
  setupController(controller) {
    this.controllerFor('network.query').set('years', [2002,2008]);

    let self = this;

    localforage.keys(function(err, keys) {
      // An array of all the key names.
      if (typeof keys.indexOf('dbVersion') !== undefined) {
        localforage.getItem('dbVersion').then((dbVersion) => {
          if (dbVersion != self.dbVersion) {
            self.refreshAllData(controller);
            localforage.setItem('dbVersion', self.dbVersion).then(() => {
              console.log('Local DB was updated!');
            });
          } else if (keys.indexOf('countries') === -1) {
            self.refreshData('countries', `${self.host}/api/${self.namespace}/contracts/countries`, controller);
          } else if (keys.indexOf('cpvs') === -1) {
            self.refreshData('cpvs', `${self.host}/api/${self.namespace}/contracts/cpvs/autocomplete`, controller);
          } else {
              console.log('Local DB does not need an update.');
          }
        });
      } else {
        self.refreshAllData(controller);
      }
      localforage.getItem('countries').then((countries) => {
        self.controllerFor('network.query').set('countries', countries);
      });
      localforage.getItem('cpvs').then((cpvs) => {
        self.controllerFor('network.query').set('cpvs', cpvs);
      });
    });
  },
});
