import Ember from 'ember';

export default Ember.Controller.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service(),
});
