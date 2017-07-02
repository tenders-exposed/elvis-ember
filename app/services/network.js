import Ember from 'ember';

export default Ember.Service.extend({
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
    //check if in network is clustered then take it from clusters
    //else from nodes
    let node = _.find(this.get('suppliers'), (o) => {
      return o.id == nodeId;
    });
    if(!node) {
      node = _.find(this.get('procurers'), (o) => {
        return o.id == nodeId;
      });
    }
    return node;
  },

  // taken from network
  getEdgeById(edgeId){
    let edge = _.find(this.get('relationships'), (o)=>{
      return o.id == edgeId;
    });
    if(typeof edge !== 'undefined') {
      edge.valueType = this.get('model.options').edges;
    }

    return edge;
  },

  setModel(model) {
    if(model.get('clusters')) {
      _.forEach(model.get('clusters'), function (cluster, clusterIndex) {
        cluster.emty = false;
        cluster.nodes = _.filter(model.get('graph.nodes'), function (node) {

          let indexCheck = _.findIndex(cluster.nodesId, function (o) {
            return  o == node.id;
          });

          if(indexCheck !== -1) {
            //console.log(`nodul ${node.id} face parte din ${clusterIndex}`);
            node.cluster = clusterIndex;
            return true;
          } else  {
            return false;
          }
        });
      });
    }
    this.set('model',model);
    this.set('edges',model.get('graph.edges'));
    this.set('nodes',model.get('graph.nodes'));
    this.set('clusters',model.get('clusters'));

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
    _.each(this.get('network.network.body.nodeIndices'), function (nodeId) {
      let node = nodes[nodeId];
      let nodeDetails = {
        'type': node.options.type,
        'id': node.id,
        'value': valueFormat(node.options.value),
        'label': node.options.label,
        'flags': node.options.flags,
        'flagsCount': node.options.flags.length,
        'nodeId' : nodeId,
        'link': node.id
      };

      if(nodeDetails.type == 'supplier') {
        suppliers.pushObject(nodeDetails);
      } else {
        procurers.pushObject(nodeDetails);
      }
    })

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

    let relationships = [];
    let edges = this.get('network.network.body.edges');
    _.each(this.get('network.network.body.edgeIndices'), function (edgeId) {
      let edge = edges[edgeId];
      let edgeDetails = {
        'flags': edge.options.flags ? edge.options.flags : [],
        'flagsCount': edge.options.flagsCount ? edge.options.flags.length : 0,
        'fromLabel': edge.from.options.label,
        'toLabel': edge.to.options.label,
        'from': edge.from.options.id,
        'to': edge.to.options.id,
        'value': valueFormat(edge.options.value),
        'id': edgeId,
        'link': `${edge.from.options.id}-${edge.to.options.id}`
      };
      relationships.pushObject(edgeDetails);
    });

    this.set('relationships',relationships);
    console.log('service - relationships', relationships);
  },

  makeClusteredNetwork(clusteredNodes, clusters){
    // clusters [ {id: "uniqueId",name: "", empty: true, type: '', nodes: []}, ]
    // clusteredNodes all nodes (clustered and notClustered)

    // console.log('service-clusteredNodes', clusteredNodes);
    // console.log('service-clusters', clusters);

    this.set('clusters', clusters);
    this.set('nodes', clusteredNodes);

    this.get('network.network').setData({
      nodes: clusteredNodes,
      edges: this.get('network.edges')
    });


    let self = this;
    let clusterOptionsByData = {};
    _.each(clusters, function (cluster, clusterIndex) {
      let clusterNameIndex = clusterIndex + 1;
      let clusterId = cluster.id;

      let clusterNodesCount = cluster.nodes.length;
      let clusterName = cluster.name ? `${cluster.name} (${clusterNodesCount})` : `cluster ${clusterIndex} (${clusterNodesCount})`;
      let nodeColor = cluster.type === 'supplier' ? "#27f0fc" : "#f0308e";

      let count = 0;
      let childEdgesOut = [];
      clusterOptionsByData = {
        joinCondition: function (childOptions) {
          count++;
          // console.log('joinCondition condition first', count);
          let condition  = (childOptions.cluster == clusterIndex && childOptions.cluster !== "");
          return condition;
        },
        processProperties: (clusterOptions,
                            childNodes, childEdges)  => {

          let flagsCount = 0;
          let flags = [];
          let value = 0;
          for (let i = 0; i < childNodes.length; i++) {
            value += childNodes[i].value;
            if(childNodes[i].flags.length) {
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
    this.set('checkClustered', false);


    // console.log('clusterOptionsByData', clusterOptionsByData);
    // console.log('nodes',  this.get('network.nodes'));
  },

  setNetwork(network) {
    // make isReady false.. and recalculate
    if(this.checkReady()) {
      this.deactivate();
    }

    if(this.get('clusters').length > 0 && !this.get('checkClustered')) {
      this.set('network', network);
      this.makeClusteredNetwork(this.get('nodes'), this.get('clusters'));
      this.set('checkClustered', true);
    } else {
      this.set('network', network);
      // console.log('seting suppliers ,procurers after cluster', this.get('network'));
      // make the clustering if there is anny to be made
      //  if the network, the nodes, the edges are set but did change then recalculate them
      this.setSuppliersProcurers();
      this.setRelationships();
      this.activate();
    }

  },

  getNetwork() {
    return this.get('network');
  }
});
