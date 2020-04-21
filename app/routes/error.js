import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Page Not Found',
  setupController(controller, error) {
    this._super(...arguments);
    controller.set('errors', error.errors);
  }
});
