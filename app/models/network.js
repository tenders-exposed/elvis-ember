import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;
const { Model, attr } = DS;

export default Model.extend({
  // nodes: attr(),
  // edges: attr(),
  name: attr('string'),
  description: attr('string'),
  query: attr(),
  graph: attr(),
  options: attr(),
  clusters: computed('graph', function() {
    return this.get('graph.clusters') || [];
  }),

  flaggedGraph: computed('graph', function() {
    let g = this.get('graph');
    _.map(g.edges, (edge) => {
      if(Object.keys(edge.flags).length > 0) {
        edge.label = '⚑';
        edge.font = {
          size: 24,
          align: 'middle'
        };
      }
    });
    return g;
  })
});
