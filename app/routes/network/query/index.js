import Ember from 'ember';
import _ from 'lodash/lodash';
// import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(/*AuthenticatedRouteMixin,*/ {
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

  setAvailable(controller, item) {
    let self = this;
    if (_.indexOf(_.keysIn(self.get('endpoints')), item) !== -1) {
      self.get('ajax').post(self.get(`endpoints.${item}`)).then((data) => {
        self.set(`availableData.${item}`, data);
        // let result = [];
        // _.each(data.search.results, function(v) {
        //   result.push(v.key)
        // });
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

    _.each(['countries', 'years', 'cpvs'], function(value) {
      self.setAvailable(controller, value);
    });
  },

  /* Custom actions */

  actions: {
    slidingAction(value) {
      // Ember.debug( "New slider value: %@".fmt( value ) );
      // this.controller.set('years', value[0]);
      this.controller.set('query.years', []);
      this.controller.get('query.years').push(value[0]);
      this.controller.get('query.years').push(value[1]);
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
