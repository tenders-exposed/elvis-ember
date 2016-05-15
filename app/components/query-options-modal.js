import Ember from 'ember';

export default Ember.Component.extend({
  refresh: true,
  
  defaults: {
    nodes: {
      name: 'sum',
      description: 'Sum of the contracts'
    },
    edges: {
      name: 'sum',
      description: 'Sum of the contracts'
    }
  },

  options: {
    nodes: [
      {
        name: 'sum',
        description: 'Sum of the contracts'
      },
      {
        name: 'count',
        description: 'Total number of contracts'
      },
    ],
    edges: [
      {
        name: 'sum',
        description: 'Sum of the contracts'
      },
      {
        name: 'count',
        description: 'Total number of contracts'
      },
    ]
  },

  actions: {

    toggleOptionsModal() {
      this.get('targetObject').send('toggleOptionsModal');
    },

    submitQuery() {
      this.sendAction();
    },

    onSelectNodes(value) {
      this.set('query.nodes', value);
    },

    onSelectEdges(value) {
      this.set('query.edges', value);
    },
  }
});
