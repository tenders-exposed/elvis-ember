import Ember from 'ember';

const { Component } = Ember;

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
