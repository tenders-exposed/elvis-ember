import DS from 'ember-data';

import { computed } from '@ember/object';
const { Model, attr } = DS;

export default Model.extend({
  // nodes: attr(),
  // edges: attr(),
  name: attr('string', {defaultValue: 'unnamedNetwork'}),
  synopsis: attr(),
  query: attr(),
  nodes: attr('nodes'),
  edges: attr(),
 // clusters: attr({ defaultValue: [] }),
  settings: attr('object', { defaultValue: function() {
    return {nodeSize: 'numberOfWinningBids', edgeSize: 'numberOfWinningBids', other: 'property'}; }
  }),

  flaggedEdges: computed('edges', function () {
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
    return {nodes: this.get('nodes'),edges: this.get('edges')};
  }),
  clusters: computed('graph', function() {
    return this.get('graph.clusters') || [];
  })
});

