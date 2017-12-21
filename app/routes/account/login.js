import Route from '@ember/routing/route';

export default Route.extend({

  activate() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('welcome');
    }
  },

  setupController(controller) {
    controller.set('loginVisible', true);
  }
});
