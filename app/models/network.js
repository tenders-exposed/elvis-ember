import DS from 'ember-data';

export default DS.Model.extend({
  // nodes: DS.attr(),
  // edges: DS.attr(),
  name: DS.attr('string'),
  description: DS.attr('string'),
  query: DS.attr(),
  graph: DS.attr(),
  options: DS.attr(),
});
