import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  classNames: ['body-network'],
  titleToken: 'Network - ',
  requestTimer: 0,

  activate() {
    this.notifications.clearAll();
    this.openSidebar();
  },

  model(params) {
    this.set('requestTimer', performance.now());
    let modelShow = this.get('store').findRecord(
      'network',
      params.network_id,
      { reload: true }
    );
    return modelShow;
  },

  afterModel(model) {
    this.get('benchmark').store('performance.network.save', (performance.now() - this.get('requestTimer')));
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

  openSidebar() {
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    this.transitionTo('network.show.details', activeTab);
  },
  actions: {
    openSidebar() {
      this.openSidebar();
    },
    // set toggled menu for show routes and subroutes
    didTransition() {
      this.controllerFor('application').set('dropMenu', 'hideMenu');
      this.controllerFor('application').set('footer', false);
    }
  }
});
