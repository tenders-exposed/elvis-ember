import Ember from 'ember';

export default Ember.Route.extend({
  classNames: ['body-page'],
  model() {
    return this.store.createRecord('user');
  },
  setupController(controller, model) {
    controller.set('model', model);
  }
});
