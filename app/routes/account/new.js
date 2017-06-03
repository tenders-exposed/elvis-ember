import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Create an account',
  model() {
    return this.store.createRecord('user');
  },
  setupController(controller, model) {
    controller.set('model', model);
  }
});
