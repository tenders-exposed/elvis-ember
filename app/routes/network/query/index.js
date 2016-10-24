import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  endpoints: {
    'countries': '/contracts/countries',
    'years': '/contracts/years',
    'cpvs': '/contracts/cpvs'
  },

  /* Custom functions */

  setAvailable(controller, item, options) {
    let self = this;
    if (_.indexOf(_.keysIn(self.get('endpoints')), item) !== -1) {
      self.get('ajax').post(self.get(`endpoints.${item}`), options).then((data) => {
        controller.set(item, data.search.results);
      });
    } else {
      console.error(`Unknown set '${item}'`);
    }
  },

  // refreshData(name, path, controller) {
  //   let self = this;
  //   localforage.removeItem(name, function() {
  //     self.get('ajax').post(path).then((data) => {
  //       localforage.setItem(name, data.search.results).then(() => {
  //         localforage.getItem(name).then((result) => {
  //           controller.set(name, result);
  //         });
  //       });
  //     });
  //   });
  // },

  // refreshAllData(controller) {
  //   this.refreshData('countries', '/contracts/countries', controller);
  //   this.refreshData('cpvs', '/contracts/cpvs', controller);
  // },

  /* Hooks */

  activate() {
    console.log(_.VERSION);
    this.notifications.clearAll();
    this.notifications.info('This page might be subject to layout changes', {
      autoClear: true,
      clearDuration: 15000
    });
  },

  setupController(controller) {
    let self = this;

    _.each(['countries', 'years'], function(item) {
      self.setAvailable(controller, item);
    });


    // this.refreshAllData(controller);
  }

});
