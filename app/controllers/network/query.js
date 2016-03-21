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
    'rawCountries': [],
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
    let self = this;
    self.get('checkedItems').forEach((k,v) => {
      self.get('query.cpvs').push(k.code);
    });
    self.get('query.rawCountries').forEach((k,v) => {
      self.get('query.countries').push(k.key);
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
      ////self.send('loading');

      self.notifications.info('This is probably going to take a while...', {
        autoClear: false
      });

      let network = this.get('store').createRecord('network', {
        options: {
          nodes: this.get('query.nodes'),
          edges: this.get('query.edges'),
        },
        query: {
          cpvs: this.get('query.cpvs').push('45214600'),
          countries: this.get('query.countries').uniq(),
          years: this.get('query.years'),
        }
      }).save().then((data) => {
        console.log(data);
        //self.send('finished');
        //self.transitionToRoute('network.query.show', data.id)
        self.transitionToRoute('network.show', 1)
      });

    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
