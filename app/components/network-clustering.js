import Component from '@ember/component';
import $ from 'jquery';
import { observer } from '@ember/object';
import { set as EmberSet } from '@ember/object';

export default Component.extend({
  clusters: [],
  searchNode: '',
  searchCluster: '',
  savingClusters: false,
  modified: false,
  modifiedCluster: false,
  currentClusterIndex: 0,
  // array of ids of clusters that were saved and now are deleted
  deletedClusters: [],

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
      // 'id': '' if the cluster has an id then it was saved by the backend
      'label': '',
      'empty': true,
      'type': '',
      'nodes': [],
      'edit': false,
      'hide': false
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
        // check if NOT luster and NOT hidden
        let check = false;
        if (((typeof node.nodes === 'undefined') || node.nodes.length == 0)
         && ((typeof node.hidden === 'undefined') || node.hidden === false)) {
          check = true;
        }
        return check;
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
        let label =  _.toLower(_.toString(cluster.label));
        if (label.match(mkRegex(searchWord))) {
          EmberSet(cluster, 'hide', false);
        } else {
          EmberSet(cluster, 'hide', true);
        }
      });
    },
    editCluster(clusterIndex) {
      $(`.cluster${clusterIndex} .edit-cluster-name`).addClass('hide');
      $(`.cluster${clusterIndex} .save-cluster-name`).removeClass('hide');
      $(`.cluster${clusterIndex} .cluster-text-input`).focus();
    },
    saveClusterName(clusterName, clusterIndex) {

      this.set(`clusters.${clusterIndex}.label`, clusterName);
      this.set(`clusters.${clusterIndex}.edit`, true);
      $(`.cluster${clusterIndex} .save-cluster-name`).addClass('hide');
      $(`.cluster${clusterIndex} .edit-cluster-name`).removeClass('hide');

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
        this.set(`clusters.${clusterIndex}.label`, nodeLabel);
        this.addEmptyCluster();
      } else {
        this.set(`clusters.${clusterIndex}.edit`, true);
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
      node.hidden = false;

      this.get('nodesClustering').pushObject(node);
      // remove it from cluster
      this.set(`clusters.${clusterIndex}.edit`, true);
      this.get('clusters')[clusterIndex].nodes.removeAt(nodeIndex);
      this.checkModified(clusterIndex);

      if (this.get('clusters')[clusterIndex].nodes.length === 0) {
        // then the cluster will also be deleted.
        // check to see if it was saved
        if (this.get('clusters')[clusterIndex].id) {
          this.get('deletedClusters').push(this.get('clusters')[clusterIndex].id);
          // console.log('delete Cluster ', clusterIndex);
        }
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
        node.hidden = false;
        return node;
      });
      this.get('nodesClustering').pushObjects(clusterNodes);
      if (this.get('clusters')[clusterIndex].id) {
        this.get('deletedClusters').push(this.get('clusters')[clusterIndex].id);
        // console.log('delete Cluster', clusterIndex);
      }
      this.get('clusters').removeAt(clusterIndex);

      this.checkModified();
    },

    closeModal() {

      this.get('clusters').removeAt(this.get('clusters').length - 1);
      // console.log('clusters - closeModal', this.get('clusters'));
      let self = this;

      function makeClusters(clusters, deletedClusters) {
        // console.log('into makeClusters');
        self.set('savingClusters', true);
        let networkId = self.get('networkId');
        let token = self.get('me.data.access_token');

        return new Promise(function(resolve) {
          let promises = [];
          let dataPromises = [];

          clusters.forEach((cluster, index) => {

            let clusterF = {
              'label': cluster.label,
              'type': cluster.type,
              'nodes': []
            };
            _.each(cluster.nodes, function(node) {
              clusterF.nodes.push(node.id);
            });

            let data = `{"cluster": ${JSON.stringify(clusterF)}}`;
            // if cluster.edit = true => modified => patch
            // else add=>post
            if ((typeof cluster.id === 'undefined') || !cluster.id) {
              // this means that the cluster is not saved yet and must add it.
              // console.log('must create cluster', clusterF);
              // console.log('must create cluster with token', token);
              promises[index] =
                self.get('ajax')
                  .post(`/networks/${networkId}/clusters`, {
                    data,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `${token}`
                    }
                  })
                  .then((response) => {
                    // store all inner promises
                    // console.log('response', response);
                    dataPromises.push(response);
                  });

            } else if (cluster.edit) {
              // then check if the cluster was modified => must update it
              // console.log('must update cluster', clusterF);
              promises[index] =
                self.get('ajax')
                  .request(`/networks/${networkId}/clusters/${cluster.id}`, {
                    data,
                    method: 'patch',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `${token}`
                    }
                  })
                  .then((response) => {
                    // store all inner promises
                    // console.log('response', response);
                    dataPromises.push(response);
                  });
            }
          });

          if (deletedClusters.length > 0) {
            // console.log('we have deletedClusters');
            _.each(deletedClusters, function(clusterId) {
              // console.log('must deleteCluster cluster', clusterId);
              let promiseDelete =  self.get('ajax')
                .request(`/networks/${networkId}/clusters/${clusterId}`, {
                  method: 'delete',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                  }
                })
                .then((response) => {
                  // store all inner promises
                  // console.log('response', response);
                  dataPromises.push(response);
                });
              promises.push(promiseDelete);
            });
          }

          Promise.all(promises).then(
            () => {
              resolve(dataPromises);
              // resolve the promise when all inner promises are resolved
            }, (response) => {
              // console.log('response-makeClusters', response);
              self.get('notifications').clearAll();
              _.forEach(response.errors, (error, index) => {
                self.get('notifications').error(`Error: ${index } ${error.title}`);
              });
            }
          );
        });
      }

      // console.log('makeclusters -modified', this.get('modified'));
      // console.log('makeclusters -clsters', this.get('clusters'));

      if (this.get('modified')) {
        makeClusters(this.get('clusters'), this.get('deletedClusters')).then(function(/*json*/) {
          // on fulfillment
          // console.log('makeclusters -response- then', json);
          self.set('savingClusters', false);
          self.sendAction('action', self.get('modified'));
          self.set('modified', false);
        }, function(response) {
          // console.log('makeclusters -response- rejection', reason);
          // on rejection
          self.get('notifications').clearAll();
          if (response.errors) {
            _.forEach(response.errors, (error, index) => {
              self.get('notifications').error(`Error: ${index } ${error.title}`);
            });
          }
        });
      } else {
        self.sendAction('action', self.get('modified'));
      }
    }
  }
});
