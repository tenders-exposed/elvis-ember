import Ember from 'ember';

export default Ember.Component.extend({
  refresh: true,
  
  actions: {

    toggleOptionsModal() {
      this.get('targetObject').send('toggleOptionsModal');
    },

    submitQuery() {
      this.sendAction();
    }
  }
});
