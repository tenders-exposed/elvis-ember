import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller) {
    controller.set(
      'model', this.controllerFor('network.show').get('model')
    );
    controller.set(
      'gridOptions.suppliers.rowData', this.controllerFor('network.show').get('model.graph.nodes')
    );
    controller.set(
      'gridOptions.procurers.rowData', this.controllerFor('network.show').get('model.graph.nodes')
    );
    controller.set(
      'gridOptions.relationships.rowData', this.controllerFor('network.show').get('model.graph.edges')
    );

    let self = this;

    this.controllerFor('network.show').addObserver('network', function() {
      controller.set(
        'gridOptions.suppliers.network', self.controllerFor('network.show').get('network')
      );
      controller.set(
        'gridOptions.procurers.network', self.controllerFor('network.show').get('network')
      );
      controller.set(
        'gridOptions.relationships.network', self.controllerFor('network.show').get('network')
      );
    });
  }
});
