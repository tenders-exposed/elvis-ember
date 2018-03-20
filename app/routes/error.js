import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Page Not Found',
  setupController: function(controller, error) {
    // console.log('in error',error);

    controller.set('errors', error.errors);
    this._super(...arguments);
  }
});
