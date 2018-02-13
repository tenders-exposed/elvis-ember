import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return Ember.isBlank(serialized) ? {} : serialized;
  },

  serialize(deserialized) {
    return Ember.isBlank(deserialized) ? {} : deserialized;
  }
});
