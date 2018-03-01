import Controller from '@ember/controller';

export default Controller.extend({
  activeTabDetails: 'contracts',
  activeTabbuyer: 'contracts',
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

    buyers: {
      buyer: 'Government Name',
      contracts: 'Contracts',
      income: 'Income',
      bids: 'Avg bids'
    },

    bidders: {
      bidder: 'Company Name',
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
