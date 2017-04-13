import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  refresh: true,

  options: {
    nodes: [
      { name: 'sum' },
      { name: 'count' }
    ],
    edges: [
      { name: 'sum' },
      { name: 'count' }
    ]
  },

  nodes: { name: 'count' },
  edges: { name: 'count' },

  actions: {

    toggleOptionsModal() {
      this.get('targetObject').send('toggleOptionsModal');
    },

    submitQuery() {
      this.sendAction();
    },

    onSelectNodes(value) {
      this.set('nodes', value);
      this.set('query.nodes', value.name);
    },

    onSelectEdges(value) {
      this.set('edges', value);
      this.set('query.edges', value.name);
    }
  }
});
