import DS from 'ember-data';

let User = DS.Model.extend({
  _id: DS.attr(),
  email: DS.attr('string'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string')

  //id: Ember.computed('_id', function(){
  //  return this.get('_id.$oid');
  //})
});
export default User;
