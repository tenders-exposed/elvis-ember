import Ember from 'ember';

const { Component, $, observer, set: EmberSet } = Ember;

export default Component.extend({
  clusters: [],
  searchNode: '',
  searchCluster: '',
  modified: false,

  restNodesList: observer('searchNode', function() {
    if (!this.get('searchNode')) {
      _.forEach(this.get('nodesClustering'), function(node) {
        EmberSet(node, 'hide', false);
      });
    }
  }),
  restClustersList: observer('searchCluster', function() {
      if (!this.get('searchCluster')) {
        _.forEach(this.get('clusters'), function(cluster) {
          EmberSet(cluster, 'hide', false);
        });
      }
    }),

  addEmptyCluster() {
    this.get('clusters').pushObject({
      'id': `c${Date.now()}`,
      'name': '',
      'empty': true,
      'type': '',
      'nodes': []
    });
  },
  sortNodes(nodes) {
    return _.orderBy(nodes, ['type', 'label'], ['desc', 'asc']);

  },

  didReceiveAttrs() {
    let nodesClustering = _.cloneDeep(this.get('networkService.nodes'));
    let clusters = _.cloneDeep(this.get('networkService.clusters'));

    if (clusters.length >  0) {
      let notClusteredNodes = _.filter(nodesClustering, function(node) {
        return (typeof node.cluster === 'undefined') || node.cluster === '';
      });
      this.set('nodesClustering', this.sortNodes(notClusteredNodes));
    } else {
      this.set('nodesClustering', this.sortNodes(nodesClustering));
    }
    this.set('clusters', clusters);

    this.addEmptyCluster();
  },

  checkModified() {
    this.set('modified', true);
  },

  actions: {
    filterNodes(filter) {
      if (filter === 'all') {
        _.forEach(this.get('nodesClustering'), function(node) {
          EmberSet(node, 'filtered', false);
        });
      } else {
        _.forEach(this.get('nodesClustering'), function(node) {
          if (node.type != filter) {
            EmberSet(node, 'filtered', true);
          } else {
            EmberSet(node, 'filtered', false);
          }
        });
      }
    },
    searchNodeList() {
      let mkRegex = (str) => {
        let ex = str.replace('*', '.*')
          .replace('?', '.{0,1}');
        return new RegExp(`^.*${ex}.*$`, 'gi');
      };

      let searchWord = _.toLower(_.toString(this.get('searchNode')));
      _.forEach(this.get('nodesClustering'), function(node) {
        let label =  _.toLower(_.toString(node.label));
        if (label.match(mkRegex(searchWord))) {
          EmberSet(node, 'hide', false);
        } else {
          EmberSet(node, 'hide', true);
        }
      });
    },
    searchClusterList() {
      let mkRegex = (str) => {
        let ex = str.replace('*', '.*')
          .replace('?', '.{0,1}');
        return new RegExp(`^.*${ex}.*$`, 'gi');
      };

      let searchWord = _.toLower(_.toString(this.get('searchCluster')));
      _.forEach(this.get('clusters'), function(cluster) {
        let label =  _.toLower(_.toString(cluster.name));
        if (label.match(mkRegex(searchWord))) {
          EmberSet(cluster, 'hide', false);
        } else {
          EmberSet(cluster, 'hide', true);
        }
      });
    },
    editCluster(clusterIndex) {
      $(`.cluster${clusterIndex} .cluster-name`).addClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).removeClass('hide');
    },
    saveClusterName(clusterName, clusterIndex) {

      this.set(`clusters.${clusterIndex}.name`, clusterName);
      $(`.cluster${clusterIndex} .cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).addClass('hide');
      this.checkModified();

    },
    closeClusterEdit(clusterIndex) {
      $(`.cluster${clusterIndex} .cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).addClass('hide');
    },
    addToCluster(node, ops) {
      let nodeId = node.id;
      let nodeType = node.type;
      let nodeLabel = node.label;
      let clusterIndex = ops.target.index;

      // if we add a node to a cluster that has no nodes then another
      // temporary cluster will be made available
      if (this.get('clusters')[clusterIndex].nodes.length === 0) {
        this.set(`clusters.${clusterIndex}.empty`, false);
        this.set(`clusters.${clusterIndex}.type`, nodeType);
        this.set(`clusters.${clusterIndex}.name`, nodeLabel);
        this.addEmptyCluster();
      }

      let clusterType = this.get('clusters')[clusterIndex].type;

      // check to see if the node that the user wants to add is the same type as the first node added
      if (node.type === clusterType) {
        // add the node to the cluster
        this.get('clusters')[clusterIndex].nodes.pushObject(node);

        // find the index of the node in nodes to remove it from the nodes list
        let nodeIndex = _.findIndex(this.get('nodesClustering'), function(o) {
          return o.id == nodeId;
        });
        // remove the node from the node list
        this.get('nodesClustering').removeAt(nodeIndex);

      } else {
        // if is not then add a notification
        this.notifications.clearAll();
        this.notifications.warning('You need to add the same type of node to the cluster!', {
          autoClear: true
        });
      }

      this.checkModified();

    },
    removeNode(node, nodeIndex, clusterIndex) {
      // add the node back to the nodes array;
      _.unset(node, 'cluster');
      this.get('nodesClustering').pushObject(node);
      // remove it from cluster
      this.get('clusters')[clusterIndex].nodes.removeAt(nodeIndex);

      if (this.get('clusters')[clusterIndex].nodes.length === 0) {
        this.get('clusters').removeAt(clusterIndex);
      }

      this.checkModified();
    },
    deleteCluster(clusterIndex) {
      // put all nodes back in node list
      // delete cluster
      // erase the clusterIndex from all nodes before putting them back

      let clusterNodes = this.get('clusters')[clusterIndex].nodes;
      _.map(clusterNodes, function(node) {
        _.unset(node, 'cluster');
        return node;
      });
      this.get('nodesClustering').pushObjects(clusterNodes);
      this.get('clusters').removeAt(clusterIndex);

      this.checkModified();

    },

    closeModal() {
      // concat all the nodes together
      let nodesConcat = [];
      this.get('clusters').removeAt(this.get('clusters').length - 1);

      _.each(this.get('clusters'), function(cluster, index) {
        // check to see if the cluster has more than one node to be a cluster
        // if the cluster has a single node erase that cluster from the cluster array
        cluster.node_ids = [];
        _.each(cluster.nodes, function(node) {
          node.cluster = index;
          cluster.node_ids.push(node.id);
        });
        nodesConcat.pushObjects(cluster.nodes);
      });
      nodesConcat.pushObjects(this.get('nodesClustering'));

      this.sendAction('action', nodesConcat, this.get('clusters'), this.get('modified'));
      this.set('modified', false);
    }
  }
});
