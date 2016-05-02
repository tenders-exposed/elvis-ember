import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  init() {
    this.set('data', this.get('session.session.content.authenticated.user'));
  }
});
