import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    if(!Ember.isBlank(serialized)) {
      _.each(serialized, (node) => {
        if(node.type == 'bidder') {
          node.color = 'rgb(36, 243, 255)';
        } else {
          node.color = 'rgb(246, 49, 136)';
        }
      });
      return serialized;
    } else {
      return [];
    }

  },

  serialize(deserialized) {
    return deserialized;
  }
});
