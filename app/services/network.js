import Ember from 'ember';

const { Logger, Service } = Ember;

export default Service.extend({
  edges: [],
  nodes: [],
  clusters: [],

  // from network, after network is rendered
  suppliers: [],
  procurers: [],
  relationships: [],

  isReady: false,
  checkClustered: false,

  init() {
    this.set('network', undefined);
    this.set('model', undefined);
  },

  reset() {
    this.init();
  },

  // make ready
  activate() {
    this.set('isReady', true);
  },

  // make not ready
  deactivate() {
    this.set('isReady', false);
  },

  // question is ready?
  checkReady() {
    return this.get('isReady');
  },

  getModelClusters() {
    return this.get('clusters');
  },

  getModelEdges() {
    return this.get('edges');
  },

  getModelNodes() {
    return this.get('nodes');
  },

  getNodeById(nodeId) {
    // check if in network is clustered then take it from clusters
    // else from nodes
    let node = _.find(this.get('suppliers'), (o) => {
      return o.id == nodeId;
    });
    if (!node) {
      node = _.find(this.get('procurers'), (o) => {
        return o.id == nodeId;
      });
    }
    return node;
  },

  // taken from network
  getEdgeById(edgeId) {
    let edge = _.find(this.get('relationships'), (o) => {
      return o.id == edgeId;
    });

    return edge;
  },

  getFlaggedEdges(edges) {
    let edgesFlagged = _.cloneDeep(edges);

    _.map(edgesFlagged, (edge) => {
      if (Object.keys(edge.flags).length > 0) {
        let flags = '';
        for (let i = 0; i < Object.keys(edge.flags).length; i++) {
          flags += '⚑';
        }
        edge.label = flags;
        // hack because in vis-network the flags are not stored
        edge.title = _.join(_.keys(edge.flags), ', ');

      }
    });
    return edgesFlagged;
  },

  setModel(model) {
    // let edges = model.get('flaggedGraph.edges');
    // let nodesFl = model.get('flaggedGraph.nodes');

    if (!this.get('defaultNodes')) {
      let nodes = _.cloneDeep(model.get('graph.nodes'));
      this.set('defaultNodes', nodes);
    }

    if (model.get('graph.clusters')) {
      _.forEach(model.get('graph.clusters'), function(cluster, clusterIndex) {
        cluster.empty = false;
        cluster.nodes = _.filter(model.get('graph.nodes'), function(node) {

          let indexCheck = _.findIndex(cluster.node_ids, function(o) {
            return o == node.id;
          });
          if (indexCheck !== -1) {
            node.cluster = clusterIndex;
            return true;
          } else {
            return false;
          }
        });
      });
    }
    let clusters = typeof model.get('graph.clusters') === 'undefined' ? [] : model.get('graph.clusters');
    // necesary or not?
    model.set('clusters', clusters);
    // if clusters are emty set them as empty array
    model.set('graph.clusters', clusters);
    this.set('model', model);
    this.set('edges', model.get('graph.edges'));
    this.set('nodes', model.get('graph.nodes'));
    this.set('flaggedEdges', this.getFlaggedEdges(model.get('graph.edges')));
    this.set('clusters', clusters);

    return model;
  },

  setSuppliersProcurers() {
    // from network.network.body.nodesIndices & .nodes[nodeId]
    let valueFormat = (value) => {
      if (typeof value !== 'string') {
        value = value.toFixed();
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    };

    let suppliers = [];
    let procurers = [];
    let nodes = this.get('network.network.body.nodes');
    _.each(this.get('network.network.body.nodeIndices'), function(nodeId) {
      let node = nodes[nodeId];

      let nodeDetails = {
        type: node.options.type,
        id: node.id,
        value: valueFormat(node.options.value),
        unformattedValue: node.options.value,
        label: node.options.label ? node.options.label : 'n/a',
        flags: node.options.flags,
        flagsCount: node.options.flags.length,
        link: node.id,
        isCluster: node.isCluster,
        containedNodesCount: node.isCluster && node.containedNodes ? Object.keys(node.containedNodes).length : 0,
        nodeId
      };

      if (nodeDetails.type == 'supplier') {
        nodeDetails.route = 'suppliers';
        suppliers.pushObject(nodeDetails);
      } else {
        nodeDetails.route = 'procurers';
        procurers.pushObject(nodeDetails);
      }
    });

    this.set('suppliers', suppliers);
    this.set('procurers', procurers);
  },

  setRelationships() {
    let valueFormat = (value) => {
      if (typeof value !== 'string') {
        value = value.toFixed();
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    };
    let edgeValueType = this.get('model.options').edges;
    let relationships = [];
    let edges = this.get('network.network.body.edges');
    _.each(this.get('network.network.body.edgeIndices'), function(edgeId) {
      let edge = edges[edgeId];
      let flags = {};
      let flagsCount = 0;
      if (typeof edge.title !== 'undefined' && edge.title !== '') {
        let flagsLabels = _.split(edge.title, ', ');
        _.forEach(flagsLabels, (flagLabel) => {
          flags[flagLabel] = 1;
          flagsCount++;
        });
      }
      let edgeDetails = {
        flags,
        flagsCount,
        fromLabel: edge.from.options.label,
        toLabel: edge.to.options.label,
        from: edge.from.options.id,
        to: edge.to.options.id,
        value: valueFormat(edge.options.value),
        unformattedValue: edge.options.value,
        valueType: edgeValueType,
        id: edgeId,
        link: `${edge.from.options.id}-${edge.to.options.id}`,
        route: 'relationships'
      };
      relationships.pushObject(edgeDetails);
    });

    this.set('relationships', relationships);
    Logger.debug('service - relationships', relationships);
  },

  makeClusteredNetwork(clusteredNodes, clusters) {
    // clusters [ {id: "uniqueId",name: "", empty: true, type: '', nodes: []}, ]
    // clusteredNodes all nodes (clustered and notClustered)

    // console.log('service-clusteredNodes', clusteredNodes);
    // console.log('service-clusters', clusters);

    this.set('clusters', clusters);
    this.set('nodes', clusteredNodes);
    // this.set('flaggedNodes', this.getFlaggedNodes(clusteredNodes));

    this.get('network.network').setData({
      nodes: clusteredNodes,
      edges: this.get('network.edges')
    });

    let self = this;
    let clusterOptionsByData = {};
    _.each(clusters, function(cluster, clusterIndex) {
      // let clusterNameIndex = clusterIndex + 1;
      let clusterId = cluster.id;

      let clusterNodesCount = cluster.nodes.length;
      let clusterName = cluster.name ? `${cluster.name} (${clusterNodesCount})` : `cluster ${clusterIndex} (${clusterNodesCount})`;
      let nodeColor = cluster.type === 'supplier' ? '#27f0fc' : '#f0308e';
      let nodeBorder = cluster.type === 'supplier' ? '#86F4FC' : '#FF69B4';

      let count = 0;           // eslint-disable-line no-unused-vars
      let childEdgesOut = [];  // eslint-disable-line no-unused-vars
      clusterOptionsByData = {
        joinCondition: (childOptions) => {
          count++;
          // console.log('joinCondition condition first', count);
          let condition  = (childOptions.cluster == clusterIndex && childOptions.cluster !== '');
          return condition;
        },
        processProperties: (clusterOptions,
                            childNodes/*, childEdges*/)  => {

          // let flagsCount = 0;
          let flags = [];
          let value = 0;
          for (let i = 0; i < childNodes.length; i++) {
            value += childNodes[i].value;
            if (childNodes[i].flags.length) {
              flags.pushObject(childNodes[i].flags);
            }
          }
          clusterOptions.value = value;
          clusterOptions.flags = flags;
          clusterOptions.flagsCount = flags.length;
          clusterOptions.type = cluster.type;

          return clusterOptions;
        },
        clusterNodeProperties: {
          id: clusterId,
          label: clusterName,
          shape: 'dot',
          borderWidth: 1,
          color: {
            border: nodeBorder,
            background: nodeColor
          },
          shadow: {
            color: nodeColor,
            size: 7,
            x: 0,
            y: 0
          }

          /*icon: {
            face: 'FontAwesome',
            code: '\uf0c0',
            size: 40,
            color: nodeColor
          }*/
        }
      };
      self.get('network.network').cluster(clusterOptionsByData);
    });

  },

  setNetwork(network) {
    // make isReady false.. and recalculate
    if (this.checkReady()) {
      this.deactivate();
    }
    if (this.get('clusters').length > 0 && !this.get('checkClustered')) {
      this.set('network', network);
      this.makeClusteredNetwork(this.get('nodes'), this.get('clusters'));
      this.set('checkClustered', true);
    } else {

      this.set('network', network);
      this.setSuppliersProcurers();
      this.setRelationships();

      this.activate();
      // make the clustering if there is anny to be made
      // if the network, the nodes, the edges are set but did change then recalculate them
    }

  },

  getNetwork() {
    return this.get('network');
  }
});
