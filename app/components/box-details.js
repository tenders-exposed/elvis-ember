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
    let type = this.get('graphElementType');
    let graph = this.get('networkModel.graph');

    let [modelDetails] = _.filter(graph[`${type}s`], { 'id': this.get('graphElementId') });
    this.set('model', modelDetails);

    if (type === 'edge') {
      this.set('model.valueType', this.get('networkModel.options').edges);
    }
  },
  actions: {
    close() {
      this.set('network.selectedNodes', []);
      this.set('network.selectedEdges', []);
    }
  }
});
