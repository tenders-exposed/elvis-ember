import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  actions: {
    gotIt: function() {
      this.sendAction('dismiss');
    },
    change: function() {
      this.sendAction('changeSalutation');
    }
  }
});
