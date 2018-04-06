import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Create an account',
  model() {
    return this.store.createRecord('user');
  },
  setupController(controller, model) {
    controller.set('model', model);
  },
  activate() {
    let applicationController = this.controllerFor('application');
    applicationController.set('loginVisible', false);
  }
});
