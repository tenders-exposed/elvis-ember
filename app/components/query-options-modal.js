import Component from '@ember/component';

export default Component.extend({
  refresh: true,

  options: {
    nodes: [
      { name: 'amountOfMoneyExchanged' },
      { name: 'numberOfWinningBids' }
    ],
    edges: [
      { name: 'amountOfMoneyExchanged' },
      { name: 'numberOfWinningBids' }
    ]
  },

  nodes: { name: 'numberOfWinningBids' },
  edges: { name: 'numberOfWinningBids' },

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
