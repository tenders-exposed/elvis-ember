import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Controller.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session')
});
