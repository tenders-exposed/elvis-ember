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

  networkModelLoaded: observer('networkService.isReady','model', function() {
    if (this.get('model.options')) {
      this.set('fields.suppliers.value', _.capitalize(this.get('model.options.nodes')));
      this.set('fields.relationships.value', _.capitalize(this.get('model.options.edges')));
    }
    this.set('gridOptions.suppliers.rowData', this.get('networkService.suppliers'));
    this.set('gridOptions.procurers.rowData', this.get('networkService.procurers'));
    this.set('gridOptions.relationships.rowData', this.get('networkService.relationships'));
    this.set('gridOptions.loaded', true);
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
