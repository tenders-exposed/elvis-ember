import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;
const { Model, attr, hasMany } = DS;

const User = Model.extend({
  email: attr('string'),
  name: attr('string'),
  country: attr('string'),
  access_token: attr('string'),
  refresh_token: attr('string'),

  password: attr('string'),
  password_confirmation: attr('string'),

  networks: hasMany('network'),

  token: computed('access_token', function() {
    return this.get('access_token');
  })

});
export default User;
