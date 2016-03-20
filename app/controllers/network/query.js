import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../../config/environment';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service('session'),

  checkedItems: [],

  modalIsOpen: false,
  cpvModalIsOpen: false,
  yearMin: 2001,
  yearMax: 2015,
  height: window.innerHeight - 200,
  query: {
    'nodes': 'count',
    'edges': 'count',
    'countries': [],
    'years': [2004, 2007],
    'cpvs': []
  },
  // query: function() {
  //   let query = {
  //     'countries': ['PL', 'LV', 'IT'],
  //     'years': [],
  //     'cpvs': []
  //   };
  //   let cpvs = [];
  //   this.get('checkedItems').forEach((k,v) => {
  //     query.cpvs.push(v.code);
  //   });
  //   return query;
  // }.property(checkedItems),
  model() {
    return this.store.findRecord('user', this.get('session.session.content.authenticated.id'));
  },
  prepareQuery() {
    this.get('checkedItems').forEach((k,v) => {
      this.get('query.cpvs').push(k.code);
    });
  },
  actions: {
    onSelectEvent(value) {
      this.set('query.country_ids', value);
      console.log('New select value: ', value);
    },
    toggleModal() {
      // this.toggleProperty('modalIsOpen');
      this.get('checkedItems').forEach((k, v) => {
        console.log(this.get('cpvs')[v]);
      });
      this.toggleProperty('cpvModalIsOpen');
    },
    submitQuery() {
      let self = this;

      self.prepareQuery();
      self.send('loading');

      let network = this.get('store').createRecord('network', {
        options: {
          nodes: this.get('query.nodes'),
          edges: this.get('query.edges'),
        },
        query: {
          cpvs: this.get('query.cpvs'),
          countries: this.get('query.countries'),
          years: this.get('query.years'),
        }
      }).save().then((data) => {
        console.log(data);
        self.send('finished');
        self.transitionToRoute('network.query.show', data.id)
      });

    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
