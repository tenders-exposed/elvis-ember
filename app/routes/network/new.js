import Ember from 'ember';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

const { Logger } = Ember;

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Create a new network',

  songs: service(),
  ajax: service(),

  endpoints: {
    'countries': '/tenders/countries',
    'years': '/tenders/years',
    'cpvs': '/tenders/cpvs'
  },

  setAvailable(controller, item, options) {
    let self = this;
    if (_.indexOf(_.keysIn(self.get('endpoints')), item) !== -1) {
      self.get('ajax').request(self.get(`endpoints.${item}`), options).then((data) => {
        // controller.set(item, data.search.results);
        // @todo: problem with the catch; this must be modified
        if (item == 'countries') {
          _.each(data[item], function(country) {
            country.text = country.name;
          });
        }
        controller.set(item, data[item]);
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
    controller.set('query.cpvs', A([]));

    controller.set('name', this.get('songs').random());
  }
});
