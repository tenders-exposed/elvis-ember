import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  // setupController(controller) {
  //   controller.set('currentUser', {'email': this.session.content.authenticated.user.email});
  // }
});
