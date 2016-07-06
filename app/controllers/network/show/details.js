import Ember from 'ember';
// import _ from 'lodash/lodash';

export default Ember.Controller.extend({
  sidebarTabs: [
    { id: 'suppliers', title: 'Suppliers' },
    { id: 'procurers', title: 'Procurers' },
    { id: 'relationships', title: 'Relationships' }
  ],
  active: 'suppliers',

  gridOptionsBoilerplate: {
    enableColResize: true,
    suppressMovableColumns: true,
    enableSorting: true
    // enableFilter: true,
    // quickFilterText: 'suppliers'
  },

  gridOptions: {
    suppliers: {
      columnDefs: [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'label',
          cellStyle: { 'white-space': 'normal' }
        },
        { headerName: 'Value', field: 'value' }
      ],
      getRowHeight: (params) => {
        return 18 * (Math.floor(params.data.label.length / 25) + 1);
      }
    },
    procurers: {
      columnDefs: [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'label' },
        { headerName: 'Value', field: 'value' }
      ],
      getRowHeight: (params) => {
        return 18 * (Math.floor(params.data.label.length / 25) + 1);
      }
    },
    relationships: {
      columnDefs: [
        { headerName: 'From', field: 'from' },
        { headerName: 'To', field: 'to' },
        { headerName: 'Value', field: 'value' }
      ]
    }
  },

  init() {
    // this.get('gridOptions.suppliers').push(this.get('gridOptionsBoilerplate'));
    Ember.$.each(this.get('gridOptionsBoilerplate'), (k, v) => {
      this.set(`gridOptions.suppliers.${k}`, v);
      this.set(`gridOptions.procurers.${k}`, v);
      this.set(`gridOptions.relationships.${k}`, v);
    });
  },

  actions: {
    closeDetails(networkId) {
      this.transitionToRoute('network.show', networkId);
    },
    changeTab(tab) {
      this.set('active', tab);
    }
  }
});
