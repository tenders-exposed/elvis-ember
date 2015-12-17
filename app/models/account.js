import Ember from 'ember';
import DS from 'ember-data';

var Account = DS.Model.extend({
  display_name    : DS.attr('string', {
    defaultValue: function() { return 'Unknown identity'; }
  }),
  join_date       : DS.attr(),
  bio             : DS.attr('string'),
  url             : DS.attr('string'),
  avatar          : DS.attr('string'),
  user            : DS.belongsTo('user', {
    async: false
  }),
  is_owner: Ember.computed(function(){
    var session = this.container.lookup('simple-auth-session:main');
    return this.get('id').toString() === session.content.id.toString();
  }),
  computed_display_name : Ember.computed(function(){
    if (this.get('display_name')) {
      return this.get('display_name');
    } else {
      return this.get('user.email').replace(/@.*$/g, '');
    }
  }),
  formattedBio: Ember.computed(function() {
        return this.get('bio').replace(/\n\r?/g, '<br>');
  }).property('bio')
});
export default Account;
