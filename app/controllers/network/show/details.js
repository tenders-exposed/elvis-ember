import Ember from 'ember';

const { Controller, observer, inject } = Ember;

export default Controller.extend({
  me: inject.service(),
  ajax: inject.service(),

  networkInput: false,
  fields: {
    suppliers: {
      id: 'ID',
      label: 'Name',
      flags: ' ',
      value: 'Value'
    },
    relationships: {
      fromLabel: 'Procurer',
      toLabel: 'Supplier',
      flags: ' ',
      value: 'Value'
    }
  },

  sidebarTabs: [
    { id: 'suppliers', title: 'Suppliers' },
    { id: 'procurers', title: 'Procurers' },
    { id: 'relationships', title: 'Relationships' }
  ],
  activeTab: 'suppliers',

  gridOptions: {
    suppliers: {},
    procurers: {},
    relationships: {},
    loaded: false
  },

  graphChange: 0,
  stabilizedNetwork : false,

  showController: inject.controller('network.show'),

  networkLoaded: observer('showController.networkStabilization', function () {
    if(this.get('showController.networkStabilization')) {
      console.log('loadednetwork', this.get('showController.network'));
    }
  }),

  networkModelLoaded: observer('model.graph.nodes', function() {
    console.log('network-stabilization', this.get('showController').get('networkStabilization'));
    if (this.get('model.options')) {
      this.set('fields.suppliers.value', _.capitalize(this.get('model.options.nodes')));
      this.set('fields.relationships.value', _.capitalize(this.get('model.options.edges')));
    }
    if (this.get('model.graph')) {
      let model = this.get('model');
      let clusters = this.get('model.clusters');

      let valueFormat = (value) => {
        if (typeof value !== 'string') {
          value = value.toFixed();
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return value;
      };
      let graphNodes    = model.get('graph.nodes');
      let relationships = model.get('graph.edges');

      _.forEach(relationships, (value) => {

        let idFrom = value.from;
        let idTo = value.to;
        let fromObj =  _.find(graphNodes, (o) => {
          return o.id === idFrom;
        });
        let toObj =  _.find(graphNodes, (o) => {
          return o.id === idTo;
        });
        value.fromLabel = fromObj.label;
        value.toLabel = toObj.label;
        value.value = valueFormat(value.value);
        value.flagsCount = Object.keys(value.flags).length;
      });

      // process the supplier nodes
      // clusteredNodes =
      // {clusterId: {id: cluster-id, label: clusterName, value: countValue, type: '', flags: []}}
      let clusteredNodes = {supplier: {}, procuring_entity: {}};
      let nodes = {supplier: [], procuring_entity: []};
      _.forEach(graphNodes, (o) => {
            let nodeType = o.type;
            o.value = valueFormat(o.value);
            if((typeof o.cluster !== 'undefined' ) && o.cluster !== '') {
                // then the node belongs to a cluster
                let clusterIndex = o.cluster;
                // see if there are other nodes added to the same cluster
                if(typeof clusteredNodes[nodeType][clusterIndex] === 'undefined' && clusters[clusterIndex]) {
                  let clusterName = clusters[clusterIndex].name ?  clusters[clusterIndex].name : `cluster-${clusterIndex}`;
                  let cluster = {
                    id: 'cluster-'+clusters[clusterIndex].id,
                    label: clusterName,
                    type: 'supplier',
                    value: o.value,
                    flags: {},
                    count: 1,
                    cluster: true
                  };
                  clusteredNodes[nodeType][clusterIndex] = cluster;
                } else {
                  console.log('details-node', o);
                  console.log('details- cluster', clusterIndex);
                  clusteredNodes[nodeType][clusterIndex].value += o.value;
                  clusteredNodes[nodeType][clusterIndex].count++;

                }
            } else {
              //if the node does not belog to a cluster just add it to nodes
              if(typeof o.flagsCount === 'undefined') {
                o.flagsCount = Object.keys(o.flags).length;
              }
              nodes[nodeType].pushObject(o);
            }
        });
      console.log('nodes', nodes);
      console.log('clusteredNodes', clusteredNodes);


      this.set('gridOptions.suppliers.rowData', _.concat(nodes['supplier'], _.toArray(clusteredNodes['supplier'])));
      this.set('gridOptions.procurers.rowData', _.concat(nodes['procuring_entity'], _.toArray(clusteredNodes['procuring_entity'])));

      console.log('suppliers', this.get('gridOptions.suppliers.rowData'));
      console.log('procurers', this.get('gridOptions.procurers.rowData'));

      this.set(
        'gridOptions.relationships.rowData', relationships
      );
      this.set('gridOptions.loaded', true);
    }
  }),

  onFilterChanged(value) {
    this.gridOptions.api.setQuickFilter(value);
  },

  actions: {
    closeDetails(networkId) {
      this.transitionToRoute('network.show', networkId);
    },

    changeTab(tab) {
      this.set('activeTab', tab);
    },

    toggleInput() {
      this.toggleProperty('networkInput');
      return false;
    },
    saveNetworkName() {
      let networkName = this.get('model.name');
      let networkDescription = this.get('model.description');
      let networkId = this.get('model.id');
      let token = this.get('me.data.authentication_token');
      let email = this.get('me.data.email');

      let data = `{"network": { "name": "${networkName}", "description": "${networkDescription}"}}`;
      let self = this;

      this.get('ajax')
        .put(`/networks/${networkId}`, {
          data,
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': `${email}`,
            'X-User-Token': `${token}`
          }
        }).then(
          () => {
            if (this.get('session.isAuthenticated')) {
              self.get('notifications').clearAll();
              self.get('notifications').success('Done!', { autoClear: true });
              this.send('toggleInput');
            } else {
              self.get('notifications').error(`Error: Please login to save your network!`);
            }
          }, (response) => {
            self.get('notifications').clearAll();
            _.forEach(response.errors, (error, index) => {
              self.get('notifications').error(`Error: ${index } ${error.title}`);
            });
          });
    }
  }
});
