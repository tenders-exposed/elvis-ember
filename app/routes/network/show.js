import Ember from 'ember';

const { Route, inject } = Ember;

export default Route.extend({
  titleToken: 'Network - ',
  networkService: inject.service(),

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

  afterModel(model){
    this.titleToken = `${this.titleToken} ${model.get('name') || model.id}`;

    // should do the clustering thing
    // let's say the model has the several clusters
    // [ {id: "uniqueId",name: "", empty: true, type: '', nodesId: [id1, id2, id3]}, ]
    /*let clusters = [
      {id: 123456789, name: 'cluster Suppliers', type: 'supplier', nodesId: ['1175701', '1173838']},
      {id: 987654321, name: 'cluster procurer', type: 'procuring_entity', nodesId: ['37389', '36921', '34292']}
    ];
    model.set('clusters', clusters);*/
    model.set('clusters', []);
    model = this.get('networkService').setModel(model);

    console.log('modelShow', model);

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
