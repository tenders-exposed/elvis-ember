import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-network'],
  titleToken: 'Network - ',
  requestTimer: 0,

  activate() {
    this.notifications.clearAll();
    this.openSidebar();
  },

  model(params) {
    let self = this;
    this.set('requestTimer', performance.now());
    return this.get('store').findRecord(
      'network',
      params.network_id
    ).then(function(response) {
      self.titleToken = `${self.titleToken} ${response.name || response.id}`;
      response = self.get('networkService').setModel(response);
      return response;
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
    let activeTab = this.controllerFor('network.show.details').get('activeTab');
    this.transitionTo('network.show.details', activeTab);
  },
  actions: {
    /* error(error, transition) {
      console.log('error.show', error);
      console.log('error.transition.show', transition);
    },*/
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
