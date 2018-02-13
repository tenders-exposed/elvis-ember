import DS from 'ember-data';

import { computed } from '@ember/object';
const { Model, attr } = DS;

export default Model.extend({
  country: attr({ defaultValue: '' }),
  label: attr('string', { defaultValue: '' }),
  medianCompetition: attr('number', { defaultValue: 0 }),
  type: attr('string'),
  value: attr()
  //flags: attr({ defaultValue: {}})
});