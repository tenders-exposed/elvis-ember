import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  // Session is now automatically injected everywhere
  // session: Ember.inject.service('session'),

  network: {},
  selectedCodes: [],
  cpvModalIsOpen: false,
  optionsModalIsOpen: false,
  yearMin: 2001,
  yearMax: 2015,
  height: window.innerHeight - 200,
  query: {
    'nodes': 'count',
    'edges': 'count',
    'rawCountries': [],
    'countries': [],
    'years': [2008, 2010],
    'cpvs': []
  },
  defaults: {
    years: {
      min: 2008,
      max: 2011
    }
  },

  prepareQuery() {
    let self = this;
    self.get('selectedCodes').forEach((v) => {
      self.get('query.cpvs').push(v.code.replace(/0*$/g, ''));
    });
  },

  actions: {

    onSelectEvent(value) {
      this.set('query.countries', []);
      value.forEach((v) => {
        this.get('query.countries').push(v.key);
      });
      this.set('query.country_ids', value);
      // this.prepareQuery();
    },

    slidingAction(value) {
      // Ember.debug( "New slider value: %@".fmt( value ) );
      // this.controller.set('years', value[0]);
      this.set('query.years', []);
      this.get('query.years').push(value[0]);
      this.get('query.years').push(value[1]);
      Ember.run.scheduleOnce('afterRender', function() {
        Ember.$('span.left-year').text(value[0]);
        Ember.$('span.right-year').text(value[1]);
      });
      this.set('query.years', _.range(this.get('query.years')[0], ++this.get('query.years')[1]));
    },

    toggleCpvModal() {

      let self = this;
      let options = `{
        "query": {
            "countries": ["${self.get('query.countries').join('", "')}"],
            "years": [${self.get('query.years').join(', ')}]
        }
      }`;

      this.get('ajax')
        .post('/contracts/cpvs', {data: options, headers: {"Content-Type": 'application/json'}})
        .then((data) => {
          self.set('cpvs', data.search.results);
          this.toggleProperty('cpvModalIsOpen');
        });
    },

    toggleOptionsModal() {
      this.toggleProperty('optionsModalIsOpen');
    },

    submitQuery() {
      let self = this;

      // // self.send('loading');

      self.notifications.info('This is probably going to take a while...', {
        autoClear: false
      });

      self.set('isLoading', true);

      this.get('store').createRecord('network', {
        options: {
          // nodes: this.get('query.nodes.name'),
          // edges: this.get('query.edges.name')
          nodes: 'count',
          edges: 'count'
        },
        query: {
          cpvs: this.get('query.cpvs').uniq(),
          countries: this.get('query.countries').uniq(),
          years: this.get('query.years').uniq(),
        }
      }).save().then((data) => {
        // self.set('network', data);
        // alert('data');
        // console.log(data);
        // alert('data2');
        // self.send('finished');
        // self.transitionToRoute('network.query.show', data.id)
        self.set('isLoading', false);
        self.toggleProperty('optionsModalIsOpen');
        self.transitionToRoute('network.show', data.id);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
