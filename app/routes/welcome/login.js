import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  classNames: ['body-page'],
  setupController(controller) {
    if(controller.get('session.isAuthenticated')) {
      this.transitionTo('welcome');
    }
  },
  actions: {
    goHome() {
      this.transitionTo('welcome');
    }
  }
});
