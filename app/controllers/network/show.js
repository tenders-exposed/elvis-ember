import Ember from 'ember';

export default Ember.Controller.extend({
  queryCtl: Ember.inject.controller('network.query'),
  query: Ember.computed.reads('queryCtl.query'),

  nodes: Ember.computed(function() {
    return new vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);
  }),
  edges: Ember.computed(function() {
   return new vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]);
  }),

  model() {
    console.log('query: ', this.get('query'));
  }
});
