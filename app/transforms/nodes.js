import DS from 'ember-data';
import { isBlank } from '@ember/utils';

const { Transform } = DS;

export default Transform.extend({
  deserialize(serialized) {
    if (!isBlank(serialized)) {
      _.each(serialized, (node) => {
        if (node.type == 'bidder') {
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
