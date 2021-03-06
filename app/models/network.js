import DS from 'ember-data';

import { computed } from '@ember/object';
const { Model, attr } = DS;

export default Model.extend({
  name: attr('string', { defaultValue: 'unnamedNetwork' }),
  synopsis: attr(),
  query: attr(),
  nodes: attr('nodes'),
  edges: attr(),
  clusters: attr('array'),
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
      if ((typeof edge.flags !== 'undefined') && Object.keys(edge.flags).length > 0) {
        let flags = '';
        for (let i = 0; i < Object.keys(edge.flags).length; i++) {
          flags += '⚑';
        }
        edge.label = flags;
        // hack because in vis-network the flags are not stored
        edge.title = _.join(_.keys(edge.flags), ', ');
      }

      if (edge.type == 'partners') {
        edge.dashes = [15,15];
        edge.arrows = {
          to: {
            enabled: false
          }
        };
        edge.scaling = { max: 5 };
      }
    });

    return edgesFlagged;
  }),

  graph: computed('nodes', 'edges', function() {
    let nodes = this.get('nodes');
    if (this.get('clusters') && this.get('clusters').length > 0) {
      _.each(this.get('clusters'), function(cluster) {
        if (cluster.type == 'buyer') {
          cluster.color = {
            background: 'rgb(246, 49, 136)',
            border: '#f0308e',
            hover: {
              background: 'rgb(246, 49, 136)',
              border: '#f0308e'
            },
            highlight: {
              background: 'rgb(246, 49, 136)',
              border: '#f0308e'
            }
          };
        } else {
          cluster.color = {
            background: 'rgb(36, 243, 255)',
            border: '#27f0fc',
            hover: {
              background: 'rgb(36, 243, 255)',
              border: '#27f0fc'
            },
            highlight: {
              background: 'rgb(36, 243, 255)',
              border: '#27f0fc'
            }
          };
        }
        cluster.cluster = true;
      });
      nodes.pushObjects(this.get('clusters'));
      return {
        nodes,
        edges: this.get('edges'),
        clusters: this.get('clusters')
      };
    } else {
      return {
        nodes,
        edges: this.get('edges'),
        clusters: []
      };

    }

  })
});
