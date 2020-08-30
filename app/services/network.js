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

  // settings
  edgeFlagsEnabled: true,
  nodeFlagsEnabled: true,
  networkType: 'contracts',

  init() {
    this._super(...arguments);
    this.set('network', undefined);
    this.set('model', undefined);
    this.set('bidders', []);
    this.set('buyers', []);
    this.set('relationships', []);
    this.set('nodes', []);
    this.set('edges', []);
    this.set('clusters', []);
    this.set('isReady', false);
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

    let self = this;
    let readyServiceModel = new Promise(function(resolve) {
      if (!self.get('defaultNodes')) {
        let nodes = _.cloneDeep(model.get('graph.nodes'));
        self.set('defaultNodes', nodes);
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

      self.set('model', model);
      self.set('edges', model.get('edges'));
      self.set('nodes', model.get('graph.nodes'));
      self.set('flaggedEdges', model.get('flaggedEdges'));
      self.set('clusters', model.get('clusters'));

      resolve(model);
    });

    this.set('readyServiceModel', readyServiceModel);
    return readyServiceModel;
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
    _.each(nodes, function(node) {

      let nodeDetails = {
        type: node.type,
        id: node.id,
        hidden: node.hidden,
        value: valueFormat(node.value),
        medianCompetition: valueFormat(node.medianCompetition),
        unformattedValue: node.value,
        label: node.label,
        flags: node.flags ? node.flagsCount : {},
        flagsCount: node.flags ? node.flags.length : 0,
        link: node.id,
        isCluster: ((typeof node.nodes === 'undefined') ? false : true),
        containedNodesCount: ((typeof node.nodes === 'undefined') ? false : node.nodes.length)
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
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    };

    /*
      "edges": [
      {
      "id": "string",
      "type": "contracts",
      "to": "string",
      "from": "string",
      "value": 0,
      "hidden": true
      }
      ]
    */

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
        fromType: edge.from.options.type,
        toType: edge.from.options.type,
        hidden: edge.options.dashes ? true : false,
        type: edge.options.dashes ? 'partners' : 'contracts',
        value: valueFormat(edge.options.value),
        unformattedValue: edge.options.value,
        valueType: edgeValueType,
        id: edgeId,
        link: `${edge.options.id}`,
        route: 'relationships'

      };
      relationships.pushObject(edgeDetails);
    });

    let orderedRelationships = _.orderBy(relationships, 'unformattedValue', 'desc');
    this.set('relationships', orderedRelationships);
  },

  setNetwork(network, networkDefer) {
    // make isReady false.. and recalculate
    // networkDeferer defined in network.show controller and resolved in network.service
    console.log('setNetworkservice ******************************');
    this.set('networkDefer', networkDefer);
    let self = this;
    if (self.checkReady()) {
      self.deactivate();
    }

    self.set('network', network);
    self.setbiddersbuyers();
    self.setRelationships();
    self.activate();

    networkDefer.resolve();
  },

  switchTypeValue() {

    _.map(this.get('nodes'), (node) => {
      try {
        this.get('network.network.body.data.nodes').update({
          id: node.id,
          value: node.valueAmount
        });
      }
      catch (err) {
        alert(err);
      }
    });

    _.map(this.get('flaggedEdges'), (edge) => {
      try {
        this.get('network.network.body.data.edges').update({
          id: edge.id,
          value: edge.valueAmount,
          from: edge.from,
          to: edge.to
        });

      }
      catch (err) {
        alert(err);
      }
    });
    if (this.get('networkType') == 'contracts') {
      // switch nodes & edges to amount type
      _.map(this.get('nodes'), (node) => {
        try {
          this.get('network.network.body.data.nodes').update({
            id: node.id,
            value: node.valueAmount,
            valueType: 'amountOfMoneyExchanged'
          });
        }
        catch (err) {
          alert(err);
        }
      });

      _.map(this.get('edges'), (edge) => {
        try {
          this.get('network.network.body.data.edges').update({
            id: edge.id,
            value: edge.valueAmount,
            valueType: 'amountOfMoneyExchanged'

          });

        }
        catch (err) {
          alert(err);
        }
      });

      this.set('networkType', 'amount');

    } else {

      _.map(this.get('nodes'), (node) => {
        try {
          this.get('network.network.body.data.nodes').update({
            id: node.id,
            value: node.valueBids,
            valueType: 'numberOfWinningBids'

          });
        }
        catch (err) {
          alert(err);
        }
      });

      _.map(this.get('edges'), (edge) => {
        try {
          this.get('network.network.body.data.edges').update({
            id: edge.id,
            value: edge.valueBids,
            valueType: 'numberOfWinningBids'

          });

        }
        catch (err) {
          alert(err);
        }
      });
      this.set('networkType', 'contracts');

    }
  },

  changeValueRange() {
    let min = this.get('model.valueRange.nodeMin');
    let max = this.get('model.valueRange.nodeMax') - 5;
    min = 3;
    max = 14;

    _.map(this.get('nodes'), (node) => {
      if (node.value > max || node.value < min) {
        let color = node.type == 'bidder' ? '#1B5559' : '#611430';
        this.get('network.network.body.data.nodes').update({
          id: node.id,
          color
        });
      }
    });
  },

  toggleNodeFlags() {
    // should have a property labelFlags = flag1 + flag2 +..
    // to draw in visjs. not manipulate the actual flags object
    if (this.get('nodeFlagsEnabled')) {
      _.map(this.get('nodes'), (node) => {
        try {
          this.get('network.network.body.data.nodes').update({
            id: node.id,
            flags: undefined
          });
        }
        catch (err) {
          alert(err);
        }
      });
      this.set('nodeFlagsEnabled', false);

    } else {
      _.map(this.get('nodes'), (node) => {
        let flags = (typeof node.flags !== 'undefined') && Object.keys(node.flags).length > 0
                    ? node.flags
                    : undefined;
        try {
          this.get('network.network.body.data.nodes').update({
            id: node.id,
            flags
          });
        }
        catch (err) {
          alert(err);
        }
      });
      this.set('nodeFlagsEnabled', true);
    }
  },
  toggleEdgeFlags() {
    if (this.get('edgeFlagsEnabled')) {
      _.map(this.get('flaggedEdges'), (edge) => {
        try {
          this.get('network.network.body.data.edges').update({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            label: undefined
          });
        }
        catch (err) {
          alert(err);
        }
      });
      this.set('edgeFlagsEnabled', false);
    } else {
      _.map(this.get('flaggedEdges'), (edge) => {
        let labelEdge = edge.label ? edge.label : undefined;
        try {
          this.get('network.network.body.data.edges').update({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            label: labelEdge
          });
        }
        catch (err) {
          alert(err);
        }

      });
      this.set('edgeFlagsEnabled', true);
    }
  },
  getNetwork() {
    return this.get('network');
  }
});
