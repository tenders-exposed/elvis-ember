import Ember from 'ember';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

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
  },

  setupController(controller) {
    // reset data
    console.log('resetting data');
    controller.setProperties({
      wizardErrorMessage: false ,
      wizardShowNextStep: true,
      query: new EmberObject({
        'nodeSize': 'numberOfWinningBids',
        'edgeSize': 'numberOfWinningBids',
        'rawCountries': A([]),
        'rawActors': A([]),
        'actors': A([]),
        'countries': A([]),
        'years': A([2004, 2010]),
        'cpvs': A([]),
        'edges': 'numberOfWinningBids',
        'nodes': 'numberOfWinningBids'
      }),
      loading: {
        years: false,
        cpvs: true
      },
      shouldUpdate: {
        'years': false,
        'cpvs': false
      },
      wizardSteps:  {
        'countriesStatus': 'current',
        'yearsStatus': 'disabled',
        'cpvsStatus': 'disabled',
        'optionStatus': 'disabled'
      }
    });


    let self = this;
    _.each(['countries', 'years'], function(item) {
      self.setAvailable(controller, item);
    });
    //controller.set('query.cpvs', A([]));

    controller.set('name', this.get('songs').random());
  }
});
