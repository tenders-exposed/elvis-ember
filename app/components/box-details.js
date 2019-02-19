import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  typeClasses: {
    bidder: 'bidder',
    buyer: 'buyer',
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
      console.log('nodeSelected', this.get('network.network.body.data.nodes').get(elementId));

      let nodeDetails = this.get('networkService').getNodeById(elementId);
      let nodeType = nodeDetails.type == 'bidder' ? 'Company' : 'Government';

      this.set('model', nodeDetails);
      this.set('model.nodeType', nodeType);
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
    },

    setTargetNode() {
      let color = this.get('model.nodeType') == 'Company' ? '#0099a2' : '#d00066';
      let elementId = this.get('graphElementId');
      this.get('network.network.body.data.nodes').update({
        id: elementId,
        color: color
      });
      console.log('selected Nodes',  this.get('network.selectedNodes'));
      console.log('nodesIn network', this.get('networkService.network.network.body.data.nodes'));
    }
  }
});
