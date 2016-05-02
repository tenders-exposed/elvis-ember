import Ember from 'ember';
import DS from 'ember-data';
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({

  store: Ember.inject.service(),

  account: Ember.computed('session.content.authenticated.user_id', function() {
    const user_id =  this.get('session.content.authenticated.user_id');
    if (!Ember.isEmpty(user_id)) {
      return DS.PromiseObject.create({
        promise: this.get('store').findRecord('user', user_id)
      });
    }
  })
});
