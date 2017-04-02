import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    didTransition() {
      this.controllerFor('application').set('dropMenu', 'fullMenu');
      this.controllerFor('application').set('footer', 'partials/welcome-footer');
    }
  }
});