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

    let [modelDetails] = _.filter(this.get('graph')[`${type}s`], { 'id': this.get('graphElementId') });
    this.set('model', modelDetails);
  },
  actions: {
    close() {
      this.set('network.selectedNodes', []);
      this.set('network.selectedEdges', []);
    }
  }
});
