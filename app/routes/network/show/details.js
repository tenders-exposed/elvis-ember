import Ember from 'ember';
//import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend({

  setupController(controller) {

    let active = this.paramsFor('network.show.details.detail').type;
    if(active){
     controller.set('active', active);
    }

    controller.set(
      'model', this.controllerFor('network.show').get('model')
    );

    const graphNodes = this.controllerFor('network.show').get('model.graph.nodes');

    controller.set(
      'gridOptions.suppliers.rowData',
      _.filter(graphNodes, (o) => { return o.type === 'supplier' && o; })
    );
    controller.set(
      'gridOptions.procurers.rowData',
      _.filter(graphNodes, (o) => {return o.type === 'procuring_entity' && o;})
    );

    let relationships = this.controllerFor('network.show').get('model.graph.edges');
    _.forEach(relationships, function(value, key) {
      const idFrom = value.from;
      const idTo = value.to;
      const fromObj =  _.find(graphNodes, function(o) { return o.id === idFrom; });
      const toObj =  _.find(graphNodes, function(o) { return o.id === idTo; });
      value['fromLabel'] = fromObj.label;
      value['toLabel'] = toObj.label;
    });

    controller.set('gridOptions.relationships.rowData', relationships);
  }
});
