import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  ajax: Ember.inject.service('ajax'),

  checkedItems: [],

  modalIsOpen: false,
  cpvModalIsOpen: false,
  yearMin: 2001,
  yearMax: 2015,
  height: window.innerHeight - 200,
  query: {
    'nodes': 'suppliers',
    'countries': ['PL', 'LV', 'IT'],
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
      this.prepareQuery();

      this.get('session').authorize('authorizer:oauth2-bearer', (headerName, headerValue) => {
        xhr.setRequestHeader(headerName, headerValue);
      });
      let network = this.get('store').createRecord('network', {
        query: {
          cpvs: this.get('query.cpvs'),
          countries: this.get('query.countries'),
          years: this.get('query.years'),
          nodes: this.get('query.nodes'),
          edges: this.get('query.edges')
        }
      }).save().then((data) => {
        console.log(data);
      });



      // console.log(this.get('query'));
      // let self = this;

      // return this.get('ajax').request('/networks', {
      //   method: 'POST',
      //   data: {
      //     query: this.get('query')
      //   }
      // });
    }
  }
});
