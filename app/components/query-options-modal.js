import Ember from 'ember';

export default Ember.Component.extend({
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

  nodes: { name: 'sum'},
  edges: { name: 'sum'},

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
