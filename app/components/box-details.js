import Ember from 'ember';

export default Ember.Component.extend({
  typesColor: {
    'supplier': 'color-blue',
    'procuring_entity': 'color-pink'
  },

  color: Ember.computed('nodeDetails.type', function() {
    let color = this.get('typesColor')[this.get('nodeDetails.type')];
    console.log('color', color);
    return color;
  }),

  init() {
    this._super(...arguments);
    this.set('nodeId', this.get('node'));

    let [nodeDetails] = _.filter(this.get('nodesSet'), { 'id': this.get('node') });
    this.set('nodeDetails', nodeDetails);
  }
});
