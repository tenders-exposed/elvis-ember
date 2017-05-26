import Ember from 'ember';

const { Controller, observer, $, Logger } = Ember;

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
  notClusteredNodes: {},
  clusters: {},

  networkLinkModal: false,
  networkClusteringModal: false,
  networkStabilization: false,

  modelChanged: observer('model.graph.nodes', function () {
    console.log('model on show has changed');
  }),

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
      console.log('show Clustering');
      this.set('networkClusteringModal', true);
    },
    closeClustering(clusteredNodes, clusters) {
      // clusters [ {id: "uniqueId",name: "", empty: true, type: '', nodes: []}, ]
      // notClusteredNodes - nodes that have no cluster
      // clusteredNodes all nodes (clustered and notClustered)
      // model.clusters  = [ {id: "uniqueId",name: "", empty: true, type: '', nodes: [id1, id2, id3]}, ]
      this.set('networkClusteringModal', false);
      this.set('model.clusters', clusters);
      this.set('model.graph.nodes', clusteredNodes);

       console.log('show-clusteredNodes', clusteredNodes);
       console.log('show-clusteredNodes', clusteredNodes.length);
       console.log('show-clusters', clusters);
       console.log('show-clusters', clusters.length);

      this.set('model.graph.nodes', clusteredNodes);

      this.get('network.network').setData({
        nodes: clusteredNodes,
        edges: this.get('network.edges')
      });

      // console.log('edges', this.get('network.edges'));
      let self = this;
      let clusterOptionsByData = {};
      _.each(clusters, function (cluster, clusterIndex) {
        let clusterNameIndex = clusterIndex + 1;
        let clusterNodesCount = cluster.nodes.length;
        let clusterName = cluster.name ? `${cluster.name} (${clusterNodesCount})` : `cluster ${clusterIndex} (${clusterNodesCount})`;
        let nodeColor = cluster.type === 'supplier' ? "#27f0fc" : "#f0308e";

        let count = 0;
        let childEdgesOut = [];
        clusterOptionsByData = {
          joinCondition: function (childOptions) {
            count++;
            //console.log('joinCondition condition first', count);
            let condition  = (childOptions.cluster == clusterIndex && childOptions.cluster !== "");
            return condition;
          },
          processProperties: (clusterOptions,
                                       childNodes, childEdges)  => {
            childEdgesOut = childEdges;
            //console.log('processProperties - childEdges', childEdges);
            //console.log('processProperties- clusterOptions', clusterOptions);
            return clusterOptions;
          },
          clusterNodeProperties: {
            id: `cluster-${clusterIndex}`,
            label: clusterName,
            shape: 'icon',
            icon: {
              face: 'FontAwesome',
              code: '\uf0c0',
              size: 40,
              color: nodeColor
            }
          }
        };
        self.get('network.network').cluster(clusterOptionsByData);

      });

      // console.log('clusterOptionsByData', clusterOptionsByData);
      // console.log('nodes',  this.get('network.nodes'));
    },
    startStabilizing() {
      this.set('startStabilizing', performance.now());
      Logger.info('start stabilizing');
    },
    stabilizationIterationsDone() {
      let network = this.get('network');
      let nodesCount = network.nodesSet.length;

      this.showNetworkInfo();

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
    }
  }
});
