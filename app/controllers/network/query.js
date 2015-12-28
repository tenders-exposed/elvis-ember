import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingCpvSelector: false,
  query: {
    'country_ids': []
  },
  actions: {
    onSelectEvent(value) {
      this.set('query.country_ids', value);
      console.log( "New select value: ", value);
    },
    toggleBasic() {
      this.toggleProperty('isShowingCpvSelector');
    },
  }
});
