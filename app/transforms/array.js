import DS from 'ember-data';
import { isBlank } from '@ember/utils';

export default DS.Transform.extend({
  deserialize(serialized) {
    return isBlank(serialized) ? [] : serialized;
  },

  serialize(deserialized) {
    return isBlank(deserialized) ? [] : deserialized;
  }
});
