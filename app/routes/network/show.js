import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-network'],
  titleToken: 'Network - ',
  requestTimer: 0,

  activate() {
    this.notifications.clearAll();
    this.openSidebar();
  },

  model(params, transition) {
    let self = this;
    this.set('requestTimer', performance.now());
    this.set('transition', transition);
    return this.get('store').findRecord(
      'network',
      params.network_id
    ).then(function(response) {
      self.titleToken = `${self.titleToken} ${response.name || response.id}`;
      return self.get('networkService').setModel(response);
    });
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
    // if there is not actually a transition to open the sidebar already
    if (!this.get('transition.params')['network.show.details']) {
      let activeTab = this.controllerFor('network.show.details').get('activeTab');
      this.transitionTo('network.show.details', activeTab);
    }
  },
  actions: {

    closeClustering(modified) {
      // console.log('closeClustering');
      this.controllerFor('network.show').set('networkClusteringModal', false);
      // check if clusters have been modified
      if (modified) {
        this.set('networkClusteringModal', false);
        window.location.reload(true);
        // refresh the page
      }
    },
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
