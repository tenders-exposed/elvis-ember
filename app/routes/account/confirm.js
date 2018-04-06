import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
  classNames: ['body-page'],
  titleToken: 'Confirm your account',
  ajax: service(),
  queryParams: {
    t: {
    }
  },
  model(params) {
    let self = this;
    let token = params.t;
    self.get('ajax').request(`/account/activate?t=${token}`).then(() => {
      self.notifications.success('Your account is now activated!', {
        autoClear: true
      });
      self.controller.transitionToRoute('welcome');
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
      // self.controller.transitionToRoute('network.new');
    });
  }
});
