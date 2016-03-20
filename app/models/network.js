import DS from 'ember-data';

export default DS.Model.extend({
  // nodes: DS.attr(),
  // edges: DS.attr(),
  _id: DS.attr(),
  query: DS.attr(),
  options: DS.attr(),
  name: DS.attr('string'),
  description: DS.attr('string'),
  graph: DS.attr(),

  //id: Ember.computed('_id', function(){
  //  return this.get('_id.$oid');
  //})
});
