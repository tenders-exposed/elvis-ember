import Ember from 'ember';

const { Controller, $, Logger } = Ember;

export default Controller.extend({
  height: window.innerHeight - 100,
  selectedNodes: [],
  selectedEdges: [],
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
      'improvedLayout': true
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
        'iterations': 1000,
        'updateInterval': 100,
        'onlyDynamicEdges': false,
        'fit': true
      }
    },
    'interaction': {
      'hover': false,
      'navigationButtons': true,
      'keyboard': true
    }
  },

  init() {
    this._super();
    this.set('stabilizationPercent', 0);
  },

  didInsertElement() {
    $('div#stabilization-info').height(window.innnerHeight - 200);
  },

  showNetworkInfo() {
    let start = this.get('startStabilizing');
    let end = performance.now();
    let timeS = _.ceil((end - start), 2);
    let iterations = this.get('stIterations');
    let nodes = this.get('model.graph.nodes').length;
    let edges = this.get('model.graph.edges').length;

    let message =
      `
          <div id="network-info">
            <p>Network info</p>
            <div class="info">
              <div class="info-name">Stabilization</div>
              <div class="info-val">${timeS} ms</div>
            </div>
            <div class="info">
              <div class="info-name">Iterations</div>
              <div class="info-val">${iterations}</div>
            </div>
            <div class="info">
              <div class="info-name">Nodes</div>
              <div class="info-val">${nodes}</div>
            </div>
            <div class="info">
              <div class="info-name">Edges</div>
              <div class="info-val">${edges}</div>
            </div>
          </div>
        `;
    this.notifications.success(message, {
      autoClear: false,
      htmlContent: true
    });

  },

  actions: {
    startStabilizing() {
      this.set('startStabilizing', performance.now());
      Logger.info('start stabilizing');
    },
    stabilizationIterationsDone() {
      this.showNetworkInfo();

      Logger.info('stabilization iterations done');
      this.set('stabilizationPercent', 100);
      $('div#stabilization-info').fadeOut();
    },
    stabilizationProgress(amount) {
      this.set('stIterations', amount.total);
      this.set('stabilizationPercent', (amount.iterations / amount.total) * 100);
      Logger.info(`Stabilization progress: ${amount.iterations} / ${amount.total}`);
    },
    stabilized(event) {
      if (event.iterations > this.get('stIterations')) {
        let diff = event.iterations - this.get('stIterations');
        Logger.info(`Network was stabilized using ${diff} iterations more than assumed (${this.get('stIterations')})`);
      }
    }
  }
});
