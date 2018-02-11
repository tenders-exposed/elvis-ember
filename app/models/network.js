import DS from 'ember-data';

import { computed } from '@ember/object';
const { Model, attr } = DS;

export default Model.extend({
  // nodes: attr(),
  // edges: attr(),
  name: attr(),
  synopsis: attr(),
  query: attr(),
  graph: attr(),
  settings: attr(),
  clusters: computed('graph', function() {
    return this.get('graph.clusters') || [];
  })
});

