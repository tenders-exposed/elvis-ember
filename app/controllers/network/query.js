import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['salutation', 'person'],
  salutation: null,
  person: null,
  modalMessage: 'bound text for modal',

  modalIsOpen: false,
  yearMin: 2001,
  yearMax: 2015,
  query: {
    'country_ids': []
  },
  actions: {
    onSelectEvent(value) {
      this.set('query.country_ids', value);
      console.log('New select value: ', value);
    },
    toggleModal() {
      this.toggleProperty('modalIsOpen');
    }
  }
});
