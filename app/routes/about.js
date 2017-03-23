import Ember from 'ember';

const { Route, inject } = Ember;

export default Route.extend({
  ajax: inject.service(),

  model() {
    this.controllerFor('loading').set('loaderWords', ['loading', 'page']);
    return this.get('ajax')
      .request('http://tenders.exposed/api/get_page?slug=about');
  },
  setupController(controller, model) {
    controller.set('model', model.page);
  }
});
