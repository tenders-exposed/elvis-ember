import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  endpoints: {
    'countries': '/contracts/countries',
    'years': '/contracts/years',
    'cpvs': '/contracts/cpvs'
  },
  availableData: {
    'countries': undefined,
    'years': undefined,
    'cpvs': undefined
  },

  /* Custom functions */

  setAvailable(controller, item, options) {
    let self = this;
    if (_.indexOf(_.keysIn(self.get('endpoints')), item) !== -1) {
      self.get('ajax').post(self.get(`endpoints.${item}`), options).then((data) => {
        self.set(`availableData.${item}`, data);
        controller.set(item, data.search.results);
      });
    } else {
      console.error(`Unknown set '${item}'`);
    }
  },

  /* Hooks */

  activate() {
    this.notifications.clearAll();
    this.notifications.info('This page might be subject to layout changes', {
      autoClear: true,
      clearDuration: 15000
    });
  },
  setupController(controller) {
    let self = this;

    _.each(['countries', 'years'], function(value) {
      self.setAvailable(controller, value);
    });
  },

});
