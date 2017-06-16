import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

  classNames: ['body-network'],
  activeTab: '',

  model(params) {
    this.set('activeTab', params.tab);
  },

  setupController(controller) {
    controller.set('model', this.controllerFor('network.show').get('model'));
    controller.set('network', this.controllerFor('network.show').get('network'));
  },

  actions: {
    nodeRowClick(selection) {
      this.controllerFor('network.show').set('network.selectedNodes', []);
      this.controllerFor('network.show').set('network.selectedEdges', []);

      this.controllerFor('network.show').get('network').moveTo(selection.id);
      this.controllerFor('network.show').get('network').network.selectNodes([selection.id]);
      this.controllerFor('network.show').set('network.selectedNodes', [selection.id]);
    },
    edgeRowClick(selection) {
      this.controllerFor('network.show').set('network.selectedNodes', []);
      this.controllerFor('network.show').set('network.selectedEdges', []);

      this.controllerFor('network.show').get('network').network.fit({
        nodes: [selection.from, selection.to],
        animation: true
      });

      this.controllerFor('network.show').get('network').network.selectEdges([selection.id]);
      this.controllerFor('network.show').set('network.selectedEdges', [selection.id]);
    }

  }
});
