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

  networkModelLoaded: observer('model', function() {
    if (this.get('model.options')) {
      this.set('fields.suppliers.value', _.capitalize(this.get('model.options.nodes')));
      this.set('fields.relationships.value', _.capitalize(this.get('model.options.edges')));
    }
    if (this.get('model.graph')) {
      let model = this.get('model');

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
      });

      this.set(
        'gridOptions.suppliers.rowData',
        _.filter(graphNodes, (o) => {
          if (o.type === 'supplier') {
            o.value = valueFormat(o.value);
            return o;
          }
        })
      );
      this.set(
        'gridOptions.procurers.rowData',
        _.filter(graphNodes, (o) => {
          if (o.type === 'procuring_entity') {
            o.value = valueFormat(o.value);
            return o;
          }
        })
      );
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

    nodeRowClick(selection) {
      this.get('network').moveTo(selection.id);
      this.get('network').network.selectNodes([selection.id]);
      this.set('network.selectedNodes', [selection.id]);
    },

    edgeRowClick(selection) {
      this.network.network.fit({
        nodes: [selection.from, selection.to],
        animation: true
      });
      this.network.network.selectEdges([selection.id]);
    },
    toggleInput() {
      this.toggleProperty('networkInput');
      return false;
    },
    saveNetworkName() {
      let networkName = this.get('model.name');
      let networkId = this.get('model.id');
      let token = this.get('me.data.authentication_token');
      let email = this.get('me.data.email');

      let data = `{"network": { "name": "${networkName}"}}`;
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
