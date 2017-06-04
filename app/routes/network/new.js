import Ember from 'ember';

const { Route, inject, Logger } = Ember;

export default Route.extend({
  classNames: ['body-page'],
  ajax: inject.service(),
  titleToken: 'Create a new network',

  endpoints: {
    'countries': '/contracts/countries',
    'years': '/contracts/years',
    'cpvs': '/contracts/cpvs'
  },

  setAvailable(controller, item, options) {
    let self = this;
    if (_.indexOf(_.keysIn(self.get('endpoints')), item) !== -1) {
      self.get('ajax').post(self.get(`endpoints.${item}`), options).then((data) => {
        controller.set(item, data.search.results);
      });
    } else {
      Logger.error(`Unknown set '${item}'`);
    }
  },

  activate() {
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
  }
});
