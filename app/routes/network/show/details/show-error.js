import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Page Not Found',
  setupController(controller, error) {
    controller.set('errors', error.payload.errors);
    this._super(...arguments);
  }
});
