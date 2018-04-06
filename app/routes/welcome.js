import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  actions: {
    didTransition() {
      this.controllerFor('application').set('dropMenu', 'fullMenu');
      this.controllerFor('application').set('footer', 'partials/footer');
    }
  }
});
