import Ember from 'ember';
import DS from 'ember-data';

let Account = DS.Model.extend({
  displayName: DS.attr('string', {
    defaultValue() {
      return 'Unknown identity';
    }
  }),
  joinDate: DS.attr(),
  bio: DS.attr('string'),
  url: DS.attr('string'),
  avatar: DS.attr('string'),
  user: DS.belongsTo('user', { async: false }),
  isOwner: Ember.computed(function() {
    let session = this.container.lookup('simple-auth-session:main');
    return this.get('id').toString() === session.content.id.toString();
  }),
  computedDisplayName: Ember.computed(function() {
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
