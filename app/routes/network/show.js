import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  titleToken: 'Network - ',

  activate() {
    this.notifications.clearAll();
  },

  model(params) {
    return this.get('store').findRecord(
      'network',
      params.network_id,
      { reload: true }
    );
  },

  afterModel(model){
    this.titleToken = `${this.titleToken} ${model.get('name') || model.id}`;

    // should do the clustering thing
    // let's say the model has the several clusters
    // [ {id: "uniqueId",name: "", empty: true, type: '', nodesId: [id1, id2, id3]}, ]
    let clusters = [
      {id: 1, name: 'cluster Suppliers', type: 'supplier', nodesId: ['1175701', '1173838']},
      {id: 2, name: 'cluster procurer', type: 'procuring_entity', nodesId: ['37389', '36921', '34292']}
    ];
    model.set('clusters', clusters);
    if(model.get('clusters')) {
      _.forEach(model.get('clusters'), function (cluster, clusterIndex) {
        cluster.emty = false;
        cluster.nodes = _.filter(model.get('graph.nodes'), function (node) {

          let indexCheck = _.findIndex(cluster.nodesId, function (o) {
            return  o == node.id;
          });

          if(indexCheck !== -1) {
            console.log(`nodul ${node.id} face parte din ${clusterIndex}`);
            node.cluster = clusterIndex;
            return true;
          } else  {
            return false;
          }
        });
      });
      //model.get('clusters').pushObject({ name: '', empty: true, type: '',  nodes: [], nodesId: []});
      // put the nodes in clusters
      //process the nodes;
    }
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
