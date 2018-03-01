import DS from 'ember-data';
import { isBlank } from '@ember/utils';

const { Transform } = DS;

export default Transform.extend({
  deserialize(serialized) {
    return isBlank(serialized) ? {} : serialized;
  },

  serialize(deserialized) {
    return isBlank(deserialized) ? {} : deserialized;
  }
});
