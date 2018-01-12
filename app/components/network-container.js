import Component from '@ember/component';

export default Component.extend({
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
