import Ember from 'ember';
import ENV from '../../config/environment';
import localforage from 'ember-local-forage';

export default Ember.Route.extend({
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
  dbVersion: ENV.APP.dbVersion,
  ajax: Ember.inject.service(),
  model() {
    return this.store.findAll('cpv');
  },
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
    this.refreshData('cpv', `${this.host}/api/${this.namespace}/contracts/cpvs/autocomplete`, controller);
  },
  setupController(controller) {
    controller.set('years', [2002,2008]);

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
          } else if (keys.indexOf('cpv') === -1) {
            self.refreshData('cpv', `${self.host}/api/${self.namespace}/contracts/cpvs/autocomplete`, controller);
          } else {
              console.log('Local DB does not need an update.');
          }
        });
      } else {
        self.refreshAllData(controller);
      }
      localforage.getItem('countries').then((countries) => {
        controller.set('countries', countries);
      });
      localforage.getItem('cpv').then((cpvs) => {
        controller.set('cpv', cpvs);
      });
    });
  },
  actions: {
    slidingAction(value) {
      // Ember.debug( "New slider value: %@".fmt( value ) );
      this.controller.set('years', value[0]);
      Ember.run.scheduleOnce('afterRender', function() {
        Ember.$('span.left-year').text(value[0]);
        Ember.$('span.right-year').text(value[1]);
      });
    },
    sendForm() {
      // console.log("Years: ", this.controller.years);
      this.transitionTo('network.show', 1);
    }
  }
});
