import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  titleToken: 'Network - ',

  activate() {
    this.notifications.clearAll();
  },

  model(params) {
    let modelShow = this.get('store').findRecord(
      'network',
      params.network_id,
      { reload: true }
    );
    return modelShow;
  },

  afterModel(model) {
    this.titleToken = `${this.titleToken} ${model.get('name') || model.id}`;
    model = this.get('networkService').setModel(model);

    return model;
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('stabilizationPercent', 0);
  },

  resetController(controller) {
    controller.set('network', undefined);
    controller.set('clusters', undefined);
  },

  actions: {
    openSidebar() {
      let activeTab = this.controllerFor('network.show.details').get('activeTab');
      this.transitionTo('network.show.details', activeTab);
    },
    // set toggled menu for show routes and subroutes
    didTransition() {
      this.controllerFor('application').set('dropMenu', 'hideMenu');
      this.controllerFor('application').set('footer', false);
    }
  }
});
