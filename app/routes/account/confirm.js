import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  queryParams: {
    t: {
    }
  },
  model(params) {
    let self = this;
    let token = params.t;
    self.get('ajax').request(`/users/confirmation?confirmation_token=${token}`).then(() => {
      self.notifications.success('Your account is now activated!', {
        autoClear: true
      });
      self.controller.transitionToRoute('index');
    }, function(response) {
      _.each(response.errors, function(error) {
        self.notifications.info('You have been redirected to our index page.', {
          autoClear: true
        });
        self.notifications.error(`${error.title} ${error.detail}`, {
          autoClear: true,
          clearDuration: 5000
        });
      });
      self.controller.transitionToRoute('network.query');
    });
  }
});
