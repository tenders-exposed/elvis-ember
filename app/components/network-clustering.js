import Ember from 'ember';

const { Component, $ } = Ember;

export default Component.extend({
  clusters: [],
  addEmptyCluster() {
    this.get('clusters').pushObject({
      'id': `c${Date.now()}`,
      'name': '',
      'empty': true,
      'type': '',
      'nodes': []
    });
  },
  didReceiveAttrs() {
    let nodesClustering = _.cloneDeep(this.get('networkService.nodes'));
    let clusters = _.cloneDeep(this.get('networkService.clusters'));

    if (clusters.length >  0) {
      let notClusteredNodes = _.filter(nodesClustering, function(node) {
        return (typeof node.cluster === 'undefined') || node.cluster === '';
      });
      this.set('nodesClustering', notClusteredNodes);
    } else {
      this.set('nodesClustering', nodesClustering);
    }
    this.set('clusters', clusters);

    this.addEmptyCluster();
  },
  actions: {
    editCluster(clusterIndex) {
      $(`.cluster${clusterIndex} .cluster-name`).addClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).removeClass('hide');
    },
    saveClusterName(clusterName, clusterIndex) {

      this.set(`clusters.${clusterIndex}.name`, clusterName);
      $(`.cluster${clusterIndex} .cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).addClass('hide');

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

      this.sendAction('action', nodesConcat, this.get('clusters'));
    }
  }
});
