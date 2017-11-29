import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({

  typeClasses: {
    supplier: 'supplier',
    procuring_entity: 'procurer',
    edge: 'relationship'
  },

  class: computed('model', function() {
    let color = this.get('model.type') ?
        this.get('typeClasses')[this.get('model.type')] :
        this.get('typeClasses').edge;
    return color;
  }),

  init() {
    this._super(...arguments);
    let typeSelected = this.get('graphElementType');
    let elementId = this.get('graphElementId');

    if (typeSelected === 'node') {
      let nodeDetails = this.get('networkService').getNodeById(elementId);
      this.set('model', nodeDetails);
      this.set('nodeId', elementId);
    }
    if (typeSelected === 'edge') {
      let edgeDetails = this.get('networkService').getEdgeById(elementId);
      this.set('model', edgeDetails);
    }
  },

  actions: {
    close() {
      this.set('network.selectedNodes', []);
      this.set('network.selectedEdges', []); // why twice?!?!?!
    }
  }
});
