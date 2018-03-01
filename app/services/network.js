import Service from '@ember/service';

export default Service.extend({
  edges: [],
  nodes: [],
  clusters: [],

  // from network, after network is rendered
  bidders: [],
  buyers: [],
  relationships: [],

  isReady: false,

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
    let node = _.find(this.get('bidders'), (o) => {
      return o.id == nodeId;
    });
    if (!node) {
      node = _.find(this.get('buyers'), (o) => {
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

  setModel(model) {
    // let edges = model.get('flaggedGraph.edges');
    // let nodesFl = model.get('flaggedGraph.nodes');

    if (!this.get('defaultNodes')) {
      let nodes = _.cloneDeep(model.get('graph.nodes'));
      this.set('defaultNodes', nodes);
    }

    if (model.get('clusters')) {
      _.forEach(model.get('clusters'), function(cluster, clusterIndex) {
        cluster.empty = false;
        cluster.nodes = _.filter(model.get('nodes'), function(node) {

          let indexCheck = _.findIndex(cluster.nodes, function(o) {
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

    this.set('model', model);
    this.set('edges', model.get('edges'));
    this.set('nodes', model.get('graph.nodes'));
    this.set('flaggedEdges', model.get('flaggedEdges'));
    this.set('clusters', model.get('clusters'));

    return model;
  },

  setbiddersbuyers() {
    // from network.network.body.nodesIndices & .nodes[nodeId]
    let valueFormat = (value) => {
      if (typeof value !== 'string' && typeof value !== 'undefined') {
        value = value.toFixed();
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    };
    /*
    * "nodes": [
     {
     "id": "string",
     "label": "string",
     "type": "bidder",
     "country": "string",
     "medianCompetition": 0,
     "value": 0,
     "hidden": true
     }
     ]
     */

    let bidders = [];
    let buyers = [];
    let nodes = this.get('nodes');
    _.each(this.get('nodes'), function(node) {

      let nodeDetails = {
        type: node.type,
        id: node.id,
        value: valueFormat(node.value),
        medianCompetition: valueFormat(node.medianCompetition),
        unformattedValue: node.value,
        label: node.label,
        flags: node.flags ? node.flagsCount : {},
        flagsCount: node.flags ? node.flags.length : 0,
        link: node.id,
        isCluster: ( (typeof node.nodes === 'undefined') ? false : true ),
        containedNodesCount: ( (typeof node.nodes === 'undefined') ? false : node.nodes.length )
      };

      if (nodeDetails.type == 'bidder') {
        nodeDetails.route = 'bidders';
        bidders.pushObject(nodeDetails);
      } else {
        nodeDetails.route = 'buyers';
        buyers.pushObject(nodeDetails);
      }
    });

    let orderedbidders = _.orderBy(bidders, ['unformattedValue', 'label'], ['desc', 'asc']);
    let orderedProducrers = _.orderBy(buyers, ['unformattedValue', 'label'], ['desc', 'asc']);
    this.set('bidders', orderedbidders);
    this.set('buyers', orderedProducrers);
  },

  setRelationships() {
    let valueFormat = (value) => {
      if (typeof value !== 'string') {
        value = value.toFixed();
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    };

     /*
      "edges": [
      {
      "type": "contracts",
      "value": 0,
      "from": "string",
      "to": "string",
      "hidden": true
      }
      ]
     * */

    let edgeValueType = this.get('model.settings').edgeSize;
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

    let orderedRelationships = _.orderBy(relationships, 'unformattedValue', 'desc');
    this.set('relationships', orderedRelationships);
  },

  setNetwork(network) {
    // make isReady false.. and recalculate
    if (this.checkReady()) {
      this.deactivate();
    }

    this.set('network', network);
    this.setbiddersbuyers();
    this.setRelationships();
    this.activate();
  },

  getNetwork() {
    return this.get('network');
  }
});
