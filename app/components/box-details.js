import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  typesColor: {
    'supplier': 'color-blue',
    'procuring_entity': 'color-pink'
  },

  color: computed('nodeDetails.type', function() {
    let color = this.get('typesColor')[this.get('nodeDetails.type')];
    return color;
  }),

  init() {
    this._super(...arguments);
    this.set('nodeId', this.get('node'));

    let [nodeDetails] = _.filter(this.get('nodesSet'), { 'id': this.get('node') });
    this.set('nodeDetails', nodeDetails);
  },
  actions: {
    close() {
      this.set('network.selectedNodes', []);
    }
  }
});
