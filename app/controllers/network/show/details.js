import Controller from '@ember/controller';
import $ from 'jquery';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';

export default Controller.extend({
  me: service(),
  ajax: service(),

  networkInput: false,
  orderOptions: {
    suppliers: [
      { 'value': 'label', 'name': 'Name' }
    ],
    relationships: [
      { 'value': 'fromLabel', 'name': 'Procurer' },
      { 'value': 'toLabel', 'name': 'Supplier' }
    ]

  },
  fields: {
    suppliers: {
      id: 'ID',
      label: 'Name',
      value: 'Value'
    },
    relationships: {
      fromLabel: 'Procurer',
      toLabel: 'Supplier',
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
  stabilizedNetwork: false,
  checkOptions: false,

  showController: controller('network.show'),

  networkModelLoaded: observer('networkService.isReady', 'model', function() {
    if (this.get('model.options') && !this.get('checkOptions')) {
      let optNodes = this.get('model.options.nodes') === 'count'
                      ? 'Amount of tenders'
                      : 'Value of tenders';
      let optEdges = this.get('model.options.edges') === 'count'
                      ? 'Amount of tenders'
                      : 'Value of tenders';

      // let optNodes = _.capitalize(this.get('model.options.nodes'));
      // let optEdges = _.capitalize(this.get('model.options.edges'));
      this.set('fields.suppliers.value', optNodes);
      this.set('fields.relationships.value', optEdges);

      this.get('orderOptions.suppliers').push({ 'value': 'value', 'name': optNodes });
      this.get('orderOptions.relationships').push({ 'value': 'value', 'name': optEdges });
      this.set('checkOptions', true);
    }
    this.set('gridOptions.suppliers.rowData', this.get('networkService.suppliers'));
    this.set('gridOptions.procurers.rowData', this.get('networkService.procurers'));
    this.set('gridOptions.relationships.rowData', this.get('networkService.relationships'));
    this.set('gridOptions.loaded', true);
  }),

  onFilterChanged(value) {
    this.gridOptions.api.setQuickFilter(value);
  },

  toggleMenu() {
    $('.navbar-toggle').click(function(e) {
      $('#main-navbar').toggleClass('open');
      e.stopPropagation();
      return false;
    });
  },

  actions: {
    toggleMenu() {
      this.toggleMenu();
    },

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
