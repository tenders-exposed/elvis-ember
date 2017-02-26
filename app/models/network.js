import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  // nodes: attr(),
  // edges: attr(),
  name: attr('string'),
  description: attr('string'),
  query: attr(),
  graph: attr(),
  options: attr()
});
