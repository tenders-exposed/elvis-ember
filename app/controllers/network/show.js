import Ember from 'ember';

export default Ember.Controller.extend({
  height: window.innerHeight - 100,
  networkOptions: {
    'nodes': {
      'shape': 'dot',
      'scaling': {
        'min': 5,
        'max': 20
        // 'label': {
        //   'enabled': true
        // }
      },
      'font': {
        'face': 'Roboto',
        'size': 10,
        'color': 'rgba(255, 255, 255, .5)',
        'strokeWidth': 2,
        'strokeColor': 'rgba(50, 50, 50, .8)'
      }
    },
    'edges': {
      'arrows': {
        'to': {
          'enabled': true,
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
      },
      // 'arrowStrikethrough': false,
      'color': {
        'color': '#313939',
        'highlight': '#b1b1b1'
      }
    },
    'layout': {
      'improvedLayout': false
    },
    'physics': {
      // 'enabled': true,
      'enabled': true,
      // 'maxVelocity': 50,
      'maxVelocity': 50,
      // 'minVelocity': 0.1,
      'minVelocity': 0.1,
      // 'solver': 'barnesHut',
      'solver': 'barnesHut',
      // 'timestep': 0.5,
      'timestep': 0.3,
      // 'adaptiveTimestep': true
      'adaptiveTimestep': true,
      'barnesHut': {
        'gravitationalConstant': -2000,
        'springConstant': 0.04,
        'damping': 0.09
      },
      'stabilization': {
        'enabled': true,
        'iterations': 1500,
        'updateInterval': 50,
        'onlyDynamicEdges': false,
        'fit': true
      }
    },
    'interaction': {
      'hover': true
    }
  },

  actions: {
    nodeClicked(nodeId) {
      this.set('nodeColor', `#${Math.floor(Math.random() * 16777215).toString(16)}`);
      console.log(`${nodeId} was clicked`);
    }
  }
});
