import Ember from 'ember';
import DS from 'ember-data';

const User = DS.Model.extend({
  email: DS.attr('string'),
  name: DS.attr('string'),
  country: DS.attr('string'),
  authentication_token: DS.attr('string'),

  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),

  networks: DS.hasMany('network'),

  token: Ember.computed('authentication_token', function() {
    return this.get('authentication_token');
  })

});
export default User;
