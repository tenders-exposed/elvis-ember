import Ember from 'ember';

export default Ember.Route.extend({
  classNames: ['body-page'],
  titleToken: 'Create an account',
  model() {
    return this.store.createRecord('user');
  },
  setupController(controller, model) {
    controller.set('model', model);
  }
});
