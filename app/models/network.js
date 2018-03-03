import DS from 'ember-data';

import { computed } from '@ember/object';
const { Model, attr } = DS;

export default Model.extend({
  name: attr('string', { defaultValue: 'unnamedNetwork' }),
  synopsis: attr(),
  query: attr(),
  nodes: attr('nodes'),
  edges: attr(),
  clusters: attr(),
  settings: attr('object', {
    defaultValue: () => {
      return {
        nodeSize: 'numberOfWinningBids',
        edgeSize: 'numberOfWinningBids',
        other: 'property'
      };
    }
  }),
  count: attr(),
  updated: attr(),
  flaggedEdges: computed('edges', function() {
    let edgesFlagged = _.cloneDeep(this.get('edges'));

    _.map(edgesFlagged, (edge) => {
      if (Object.keys(edge.flags).length > 0) {
        let flags = '';
        for (let i = 0; i < Object.keys(edge.flags).length; i++) {
          flags += '⚑';
        }
        edge.label = flags;
        // hack because in vis-network the flags are not stored
        edge.title = _.join(_.keys(edge.flags), ', ');

      }
    });
    return edgesFlagged;
  }),

  graph: computed('nodes', 'edges', function () {
    let nodes = this.get('nodes');
    if(this.get('clusters').length > 0) {
      nodes.pushObjects(this.get('clusters'));
    }
    return {
      nodes: nodes,
      edges: this.get('edges'),
      clusters: this.get('clusters')
    };
  })
});
