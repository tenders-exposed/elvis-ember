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
    bidders: [
      { 'value': 'label', 'name': 'Name' }
    ],
    relationships: [
      { 'value': 'fromLabel', 'name': 'buyer' },
      { 'value': 'toLabel', 'name': 'bidder' }
    ]

  },
  fields: {
    bidders: {
      id: 'ID',
      label: 'Name',
      value: 'Value'
    },
    relationships: {
      fromLabel: 'buyer',
      toLabel: 'bidder',
      value: 'Value'
    }
  },

  sidebarTabs: [
    { id: 'bidders', title: 'bidders' },
    { id: 'buyers', title: 'buyers' },
    { id: 'relationships', title: 'Relationships' }
  ],
  activeTab: 'bidders',

  gridOptions: {
    bidders: {},
    buyers: {},
    relationships: {},
    loaded: false
  },

  graphChange: 0,
  stabilizedNetwork: false,
  checkOptions: false,

  showController: controller('network.show'),

  networkModelLoaded: observer('networkService.isReady', 'model', function() {
    if (this.get('model.settings') && !this.get('checkOptions')) {
      let optNodes = this.get('model.settings.nodeSize') === 'numberOfWinningBids'
                      ? 'Amount of tenders'
                      : 'Value of tenders';
      let optEdges = this.get('model.settings.edgeSize') === 'numberOfWinningBids'
                      ? 'Amount of tenders'
                      : 'Value of tenders';

      // let optNodes = _.capitalize(this.get('model.settings.nodeSize'));
      // let optEdges = _.capitalize(this.get('model.settings.edgeSize'));
      this.set('fields.bidders.value', optNodes);
      this.set('fields.relationships.value', optEdges);

      this.get('orderOptions.bidders').push({ 'value': 'value', 'name': optNodes });
      this.get('orderOptions.relationships').push({ 'value': 'value', 'name': optEdges });
      this.set('checkOptions', true);
    }
    this.set('gridOptions.bidders.rowData', this.get('networkService.bidders'));
    this.set('gridOptions.buyers.rowData', this.get('networkService.buyers'));
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
      let self = this;
      this.get('model').save().then(
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
          if (response.errors) {
            _.forEach(response.errors, (error, index) => {
              self.get('notifications').error(`Error: ${index } ${error.title}`);
            });
          }
        });

    }
  }
});
