import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  activeTabDetails: 'contracts',
  activeTabProcurer: 'contracts',
  params: {},
  networkQuery: {},

  fields: {
    contracts: {
      name: 'Contract' ,
      buyer: 'Buyer',
      bids: 'Bids',
      award: 'Awarded amount'
    },
    contractsProcurer: {
      name: 'Contract' ,
      supplier: 'Supplier',
      bids: 'Bids',
      award: 'Awarded amount'
    },
    procurers: {
      procurer: 'Procurer Name',
      contracts: 'Contracts',
      income: 'Income',
      bids: 'Avg bids'
    },
    suppliers: {
      supplier: 'Supplier Name',
      contracts: 'Contracts',
      income: 'Income',
      bids: 'Avg bids'
    },
    contractsRelationship: {
      name: 'Contract' ,
      date: 'Date',
      bids: 'Bids',
      award: 'Award amount'
    }
  },

  readyToRender: false,
  modelDetails: undefined,
  actions: {
    changeTabDetails(tab) {
      this.set('activeTabDetails', tab);
    },
    changeTabProcurer(tab) {
      this.set('activeTabProcurer', tab);
    }
  }
});
