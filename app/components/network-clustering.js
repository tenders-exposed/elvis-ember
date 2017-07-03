import Ember from 'ember';

const { Component, $ } = Ember;

export default Component.extend({
  clusters: [],
  addEmptyCluster(){
    this.get('clusters').pushObject({
      'id': 'c'+Date.now(),
      'name': '',
      'empty': true,
      'type': '',
      'nodes': []
    });
  },
  didReceiveAttrs() {
    // console.log('net-clustering-length', this.get('clusters').length);
    if(this.get('clusters').length >  0) {
      let notClusteredNodes = _.filter(this.get('nodes'), function (node) {
        return (typeof node.cluster === 'undefined') || node.cluster === '' ;
      });
      this.set('nodes', notClusteredNodes);
    }
    this.addEmptyCluster();
    // console.log('clusters', this.get('clusters'));
    // console.log('nodes', this.get('nodes'));
  },
  actions: {
    editCluster(clusterIndex) {
      // console.log(`tring to edit cluster ${clusterIndex}`);
      $(`.cluster${clusterIndex} .cluster-name`).addClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).removeClass('hide');
    },
    saveClusterName(clusterName, clusterIndex) {

      // console.log(`tring to save clustername with ${clusterName} at index ${clusterIndex}`);
      this.set(`clusters.${clusterIndex}.name`, clusterName);
      $(`.cluster${clusterIndex} .cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).addClass('hide');

    },
    closeClusterEdit(clusterIndex) {
      // console.log(`tring to close edit cluster ${clusterIndex}`);
      $(`.cluster${clusterIndex} .cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-input`).addClass('hide');
    },
    addToCluster(node, ops) {
      let nodeId = node.id;
      let nodeType = node.type;
      let clusterIndex = ops.target.index;

      // if we add a node to a cluster that has no nodes then another
      // temporary cluster will be made available
      if(this.get('clusters')[clusterIndex].nodes.length === 0) {
        this.set(`clusters.${clusterIndex}.empty`, false);
        this.set(`clusters.${clusterIndex}.type`, nodeType);
        this.addEmptyCluster();
      }

      let clusterType = this.get('clusters')[clusterIndex].type;

      //check to see if the node that the user wants to add is the same type as the first node added
      if(node.type === clusterType) {
        // add the node to the cluster
        this.get('clusters')[clusterIndex].nodes.pushObject(node);

        // find the index of the node in nodes to remove it from the nodes list
        let nodeIndex = _.findIndex(this.get('nodes'), function(o) {
          return o.id == nodeId;
        });
        // remove the node from the node list
        this.get('nodes').removeAt(nodeIndex);

        // console.log('nodeIndex', nodeIndex);
        // console.log('nodes', this.get('nodes'));
        // console.log('clusters' , this.get('clusters'));

      } else {
        // if is not then add a notification
        // console.log('this node is not the same type with the other');
        this.notifications.clearAll();
        this.notifications.warning('You need to add the same type of node to the cluster!', {
          autoClear: true
        });
      }
    },
    removeNode(node, nodeIndex, clusterIndex) {
      // console.log(`nodeId ${nodeIndex} clusterName ${clusterIndex}`);

      // add the node back to the nodes array;
      _.unset(node,'cluster');
      this.get('nodes').pushObject(node);
      // remove it from cluster
      this.get('clusters')[clusterIndex].nodes.removeAt(nodeIndex);

      if(this.get('clusters')[clusterIndex].nodes.length === 0 ){
        this.get('clusters').removeAt(clusterIndex);
      }

      // console.log('cluster after empty', this.get('clusters'));
    },
    deleteCluster(clusterIndex) {
      // put all nodes back in node list
      // delete cluster
      // erase the clusterIndex from all nodes before putting them back

      let clusterNodes = this.get('clusters')[clusterIndex].nodes;
      _.map(clusterNodes, function (node) {
        _.unset(node,'cluster');
        return node;
      })
      this.get('nodes').pushObjects(clusterNodes);
      this.get('clusters').removeAt(clusterIndex);

    },
    closeModal(){
      // concat all the nodes together
      let nodesConcat = [];
      this.get('clusters').removeAt(this.get('clusters').length-1 );

      _.each(this.get('clusters'), function (cluster, index) {
        // check to see if the cluster has more than one node to be a cluster
        // if the cluster has a single node erase that cluster from the cluster array
        cluster.nodesId = [];
        _.each(cluster.nodes, function (node) {
          // console.log('here', node);
          node.cluster = index;
          // console.log('here cluster', cluster);
          cluster.nodesId.push(node.id);
        })
        nodesConcat.pushObjects(cluster.nodes);
      });
      nodesConcat.pushObjects(this.get('nodes'));
      // console.log('nodesConcat at exit-clusteredNodes - nodes', nodesConcat);
      // console.log('nodesConcat at exit-clusteredNodes - nodes', nodesConcat.length);
      // console.log('clusters at exit', this.get('clusters'));
      // console.log('clusters at exit', this.get('clusters').length);

      this.sendAction('action', nodesConcat, this.get('clusters'));
    }
  }
});
