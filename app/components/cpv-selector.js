import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  actions: {
    gotIt() {
      this.sendAction('dismiss');
    },
    change() {
      this.sendAction('changeSalutation');
    }
  }
});
