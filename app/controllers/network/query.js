import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['salutation', 'person'],
  salutation: null,
  person: null,
  modalMessage: 'bound text for modal',
  checkedItems: [],

  modalIsOpen: false,
  cpvModalIsOpen: false,
  yearMin: 2001,
  yearMax: 2015,
  height: window.innerHeight - 100,
  query: {
    'country_ids': []
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
    }
  }
});
