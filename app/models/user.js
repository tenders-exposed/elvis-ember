import DS from 'ember-data';

let User = DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),
  account: DS.belongsTo('account', { async: false })
});
export default User;
