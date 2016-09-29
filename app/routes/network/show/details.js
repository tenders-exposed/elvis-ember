import Ember from 'ember';
import _ from 'lodash';

export default Ember.Route.extend({

  setupController(controller) {
    controller.set(
      'model', this.controllerFor('network.show').get('model')
    );
    controller.set(
      'gridOptions.suppliers.rowData',
      _.filter(this.controllerFor('network.show').get('model.graph.nodes'), (o) => {
        return o.type === 'supplier' && o;
      })
    );
    controller.set(
      'gridOptions.procurers.rowData',
      _.filter(this.controllerFor('network.show').get('model.graph.nodes'), (o) => {
        return o.type === 'procuring_entity' && o;
      })
    );
    controller.set(
      'gridOptions.relationships.rowData', this.controllerFor('network.show').get('model.graph.edges')
    );
  }
});
