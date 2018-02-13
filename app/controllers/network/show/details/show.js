import Controller from '@ember/controller';

export default Controller.extend({
  activeTabDetails: 'contracts',
  activeTabbuyer: 'contracts',
  params: {},
  networkQuery: {},

  fields: {
    contracts: {
      award: 'contract name' ,
      parties: 'other parties',
      value: 'contract value (€)',
      bids: 'bids'
    },
    buyers: {
      buyer: 'Government Name',
      contracts: 'Contracts',
      income: 'Income (€)',
      bids: 'Avg bids'
    },
    bidders: {
      bidder: 'Company Name',
      contracts: 'Contracts',
      income: 'Income (€)',
      bids: 'Avg bids'
    },
    contractsRelationship: {
      award: 'contract name' ,
      value: 'contract value (€)',
      bids: 'bids'
    }
  },

  readyToRender: false,
  modelDetails: undefined,
  actions: {
    changeTabDetails(tab) {
      this.set('activeTabDetails', tab);
    },
    changeTabbuyer(tab) {
      this.set('activeTabbuyer', tab);
    }
  }
});
