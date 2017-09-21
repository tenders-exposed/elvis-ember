import Ember from 'ember';

const { Controller, $, Logger, inject } = Ember;

export default Controller.extend({
  me: inject.service(),
  ajax: inject.service(),

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

  networkInfoShown: false,
  clusters: {},

  networkLinkModal: false,
  networkClusteringModal: false,
  networkStabilization: false,

  init() {
    this._super();
    this.set('stabilizationPercent', 0);
    this.set('network', undefined);
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

    this.get('benchmark').store('performance.network.iterationsTime', timeS);
    this.get('benchmark').save();

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
    stopPhysics() {
      let physics = this.get('networkOptions.physics.enabled') ? false : true;
      this.set('networkOptions.physics.enabled', physics);
      this.get('network').setOptions({ 'physics': { 'enabled': physics } });
    },
    modalNetworkLink() {
      if (this.get('networkLinkModal')) {
        this.set('networkLinkModal', false);
      } else {
        this.set('networkLinkModal', true);
        let networkId = this.get('model.id');
        this.set('networkLink', `${document.location.origin}/network/${networkId}`);
      }
    },
    showClustering() {
      Logger.debug('show Clustering');
      this.set('networkClusteringModal', true);
    },
    closeClustering(clusteredNodes, clusters, modified) {
      // check if clusters have been modified
      if (!modified) {
        this.set('networkClusteringModal', false);
        this.set('model.clusters', clusters);
        this.set('model.graph.nodes', clusteredNodes);
      } else {
        this.set('networkClusteringModal', false);
        this.get('notifications').clearAll();
        this.get('notifications').info('Network is being redrawn. This may take a while...', { autoClear: false });

        // model.clusters  = [ {id: 'uniqueId',name: '', empty: true, type: '', node_ids: [id1, id2, id3]}, ]
        let clustersPayload = _.map(clusters, (c) => {
          return {
            'id': c.id,
            'name': c.name,
            'type': c.type,
            'node_ids': c.node_ids
          };
        });
        let nodesPayload = this.get('networkService.defaultNodes');
        let edgesPayload = this.get('networkService.edges');

        let networkId = this.get('model.id');
        let token = this.get('me.data.authentication_token');
        let email = this.get('me.data.email');

        let data = `{"network": {
                      "graph": {
                        "clusters": ${JSON.stringify(clustersPayload)}
                        }
                      }
                  }`;
        let self = this;

        this.get('ajax')
          .patch(`/networks/${networkId}`, {
            data,
            headers: {
              'Content-Type': 'application/json',
              'X-User-Email': `${email}`,
              'X-User-Token': `${token}`
            }
          }).then(
          () => {
            if (this.get('session.isAuthenticated')) {
              // close clustering popup
              self.set('model.clusters', clusters);
              self.set('model.graph.nodes', clusteredNodes);

              self.get('networkService').makeClusteredNetwork(clusteredNodes, clusters);
              self.get('notifications').clearAll();
              self.get('notifications').success('Done! Clusters saved.', { autoClear: true });
            } else {
              self.get('notifications').error(`Error: Please login to save your cluster!`);
            }
          }, (response) => {
            self.get('notifications').clearAll();
            _.forEach(response.errors, (error, index) => {
              self.get('notifications').error(`Error: ${index } ${error.title}`);
            });
          });
      }
    },
    startStabilizing() {
      this.set('startStabilizing', performance.now());
      Logger.info('start stabilizing');
    },
    stabilizationIterationsDone() {
      let network = this.get('network');
      let nodesCount = network.nodesSet.length;

      if (!this.get('networkStabilization')) {
        this.showNetworkInfo();
        this.set('networkStabilization', true);
      }

      if (nodesCount > 150) {
        network.setOptions({ physics: { enabled: false } });
        this.set('networkOptions.physics.enabled', false);
        Logger.info(`Network bigger than 150 nodes (${nodesCount}).`);
        Logger.info(`Physics disabled on rendering.`);
      }
      Logger.info('stabilization iterations done');
      this.set('stabilizationPercent', 100);
      $('div#stabilization-info').fadeOut();

      this.set('networkStabilization', true);
      Logger.info('Network stabilized');
      this.get('networkService').setNetwork(this.get('network'));

    },
    stabilizationProgress(amount) {
      this.set('stIterations', amount.total);
      this.set('stabilizationPercent', (amount.iterations / amount.total) * 100);
      Logger.info(`Stabilization progress: ${amount.iterations} / ${amount.total}`);
    },
    stabilized(event) {
      let network = this.get('network');
      let nodesCount = network.nodesSet.length;
      if (nodesCount > 100) {
        network.setOptions({ physics: { enabled: false } });
        this.set('networkOptions.physics.enabled', false);
        Logger.info(`Network bigger than 100 nodes (${nodesCount}).`);
        Logger.info(`Physics disabled after stabilizing.`);
      }
      if (event.iterations > this.get('stIterations')) {
        let diff = event.iterations - this.get('stIterations');
        Logger.info(`Network was stabilized using ${diff} iterations more than assumed (${this.get('stIterations')})`);
      }
      this.get('benchmark').store('performance.network.iterationsCount', event.iterations);
    }
  }
});
