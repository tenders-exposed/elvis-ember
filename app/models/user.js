import DS from 'ember-data';

let user = DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string')

});
export default user;
