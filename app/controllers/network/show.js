import Ember from 'ember';

export default Ember.Controller.extend({
  height: window.innerHeight - 100,
  networkOptions: {
    'nodes': {
      'shape': 'dot',
      'scaling': {
        'label': {
          'min': 5,
          'max': 20
        }
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
      'scaling': {
        'min': 1,
        'max': 15
      },
      'color': {
        'color': '#b1b1b1',
        'highlight': '#313939'
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
  },

  actions: {
    nodeClicked(nodeId) {
      this.set('nodeColor', `#${Math.floor(Math.random() * 16777215).toString(16)}`);
      console.log(`${nodeId} was clicked`);
    }
  }
});
