import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  activeTabDetails: 'contracts',
  params: {},
  networkQuery: {},

  fields: {
    contracts: {
      award: 'contract name' ,
      parties: 'other parties',
      value: 'contract value',
      bids: 'bids'
    },
    procurers: {
      procurer: 'Procurer Name',
      contracts: 'Contracts',
      income: 'Income',
      bids: 'Avg bids'
    }
  },

  actions: {
    changeTabDetails(tab) {
      this.set('activeTabDetails', tab);
    }
  }
});
