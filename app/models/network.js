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
  })
});
