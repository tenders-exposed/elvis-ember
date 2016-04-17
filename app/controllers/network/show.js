import Ember from 'ember';

export default Ember.Controller.extend({
  //queryCtl: Ember.inject.controller('network.query'),
  // query: Ember.computed(function(){
  //   return this.controllerFor('network.query').get('network.graph');
  // }),

  nodes: Ember.computed(function() {
    return new vis.DataSet(
      this.get('model.graph.nodes')
      // [
      //   {id: 1, label: 'Node 1'},
      //   {id: 2, label: 'Node 2'},
      //   {id: 3, label: 'Node 3'},
      //   {id: 4, label: 'Node 4'},
      //   {id: 5, label: 'Node 5'}
      // ]
    );
  }),
  edges: Ember.computed(function() {
    return new vis.DataSet(
      this.get('model.graph.edges')
      // [
      //   {from: 1, to: 3},
      //   {from: 1, to: 2},
      //   {from: 2, to: 4},
      //   {from: 2, to: 5}
      // ]
    );
  }),
  options: {
    'nodes': {
      'shape': 'dot',
      'scaling': {
        'label': {
          'min': 5,
          'max': 20
        }
      },
      'font': {
        'color': 'rgba(255, 255, 255, .5)',
        'strokeWidth': 2,
        'strokeColor': 'rgba(50, 50, 50, .5)'
      }
    },
    'edges': {
      'arrows': {
        'to': {
          'enabled': false,
          'scaleFactor': 0.1
        },
        'middle': {
          'enabled': false,
          'scaleFactor': 0.1
        },
        'from': {
          'enabled': false,
          'scaleFactor': 0.1
        }
      }
    },
    'physics': {
      'timestep': 0.3
    },
    'layout': {
      'improvedLayout': false
    }
    // 'physics': {
    //   'enabled': false
    // },
    // 'interaction': {
    //   'hover': true
    // }
  }
});
