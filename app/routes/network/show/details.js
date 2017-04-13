import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

  activeTab: '',

  model(params) {
    this.set('activeTab', params.tab);
  },

  setupController(controller) {
    controller.set('model', this.controllerFor('network.show').get('model'));
    controller.set('activeTab', this.get('activeTab'));
  }
});
