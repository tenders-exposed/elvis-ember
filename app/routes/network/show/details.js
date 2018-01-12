import Route from '@ember/routing/route';

export default Route.extend({

  classNames: ['body-network'],
  activeTab: '',

  model(params) {
    this.set('activeTab', params.tab);
  },

  setupController(controller) {
    controller.set('model', this.controllerFor('network.show').get('model'));
    controller.set('activeTab', this.get('activeTab'));
    controller.set('network', this.controllerFor('network.show').get('network'));
  },

  actions: {
    nodeRowClick(selection) {
      let network = this.get('networkService').getNetwork();
      network.set('selectedNodes', []);
      network.set('selectedEdges', []);

      network.moveTo(selection.id);
      network.network.selectNodes([selection.id]);
      network.set('selectedNodes', [selection.id]);
    },
    edgeRowClick(selection) {
      let network = this.get('networkService').getNetwork();
      network.set('selectedNodes', []);
      network.set('selectedEdges', []);

      network.network.fit({
        nodes: [selection.from, selection.to],
        animation: true
      });

      network.network.selectEdges([selection.id]);
      network.set('selectedEdges', [selection.id]);
    }

  }
});
