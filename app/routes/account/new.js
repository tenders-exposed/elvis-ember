import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  titleToken: 'Create an account',
  model() {
    return this.store.createRecord('user');
  },
  setupController(controller, model) {
    controller.set('model', model);
  }
});
