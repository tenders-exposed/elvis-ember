import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  typeClasses: {
    supplier: 'color-blue',
    procuring_entity: 'color-pink',
    edge: 'color-gray'
  },

  class: computed('model', function() {
    let color = this.get('model.type') ?
        this.get('typeClasses')[this.get('model.type')] :
        this.get('typeClasses').edge;
    return color;
  }),

  init() {
    this._super(...arguments);
    let graph = this.get('networkModel.graph');
    let typeSelected = this.get('graphElementType');
    let elementId = this.get('graphElementId');

    console.log('selected-node-edge-box-details ->', this.get('graphElementId'));

    if(typeSelected === 'node') {
      if(this.get('network.network').isCluster(this.get('graphElementId'))) {
        let nodesInCluster = this.get('network.network').getNodesInCluster(this.get('graphElementId'));
        this.set('cluster', true);

        let modelDetails = _.filter(graph['nodes'], function(node) {
          return _.indexOf(nodesInCluster, node.id) === -1 ? false : true;
        });
        this.set('model', modelDetails);

      } else {
        let type = this.get('graphElementType');
        let [modelDetails] = _.filter(graph[`${type}s`], { 'id': this.get('graphElementId') });
        this.set('model', modelDetails);
      }

    }
    if(typeSelected === 'edge') {

      console.log('*!*! network on boxinfo',this.get('network.network'));
      //console.log('*!*! network on boxinfo - clustering-clusteredEdges',this.get('network.network.clustering.clusteredEdges'));

      //let edgeId = this.get('network.network.clustering').getBaseEdge(elementId);
      //console.log('*!*! network on boxinfo- getBaseEdge', edgeId);

      //let clusteredEdges = this.get('network.network.clustering').getClusteredEdges(edgeId);
      //console.log('clustered edges', clusteredEdges);

      //let [edgeDetails] = _.filter(graph['edges'], { 'id': edgeId });
      //console.log('edgeDetails  in cluster', edgeDetails);

     // this.set('model.valueType', this.get('networkModel.options').edges);

      let edge = this.get('network.network').body.edges[elementId];
      let edgeDetails = {
        fromLabel: edge.from.options.label,
        toLabel: edge.to.options.label,
        value: edge.options.value,
        valueType: this.get('networkModel.options').edges
      }
      this.set('model', edgeDetails);
      console.log('selected edge', edge);

    }

    //




  },
  actions: {
    close() {
      this.set('network.selectedNodes', []);
      this.set('network.selectedEdges', []);
    }
  }
});
