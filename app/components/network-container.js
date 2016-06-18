import Ember from 'ember';

export default Ember.Component.extend({
  // tagName: 'div',
  actions: {
    startStabilizing() {
      this.sendAction('startStabilizing');
    },
    stabilizationIterationsDone() {
      alert('stabilization iterations done');
    }
  }
});
