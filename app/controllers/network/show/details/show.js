import Controller from '@ember/controller';

export default Controller.extend({
  activeTabDetails: 'contracts',
  activeTabbuyer: 'contracts',
  params: {},
  networkQuery: {},

  sort: 'value',
  fields: {
    contracts: {
      title: {
        label: 'Contract',
        sort: false
      } ,
      buyers: {
        label: 'Buyer',
        sort: false
      },
      bids: {
        label: 'Bids',
        sort: true
      },
      year: {
        label: 'Year',
        sort: true
      },
      indicators: {
        label: 'Indicators',
        sort: false
      },
      value: {
        label: 'Awarded amount',
        sort: true
      }
    },
    contractsProcurer: {
      title: {
        label: 'Contract', sort: false
      },
      bidders: {
        label: 'Bidder', sort: false
      },
      bids: {
        label: 'Bids', sort: true
      },
      year: {
        label: 'Year',
        sort: true
      },
      indicators: {
        label: 'Indicators',
        sort: false
      },
      value: {
        label: 'Awarded amount', sort: true
      }
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
      title: {
        label: 'Contract', sort: false
      },
      date: {
        label: 'Date', sort: false
      },
      bids: {
        label: 'Bids', sort: true
      },
      year: {
        label: 'Year', sort: false
      },
      indicators: {
        label: 'Indicators',
        sort: false
      },
      value: {
        label: 'Award amount', sort: true
      }
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
    },
    redirectLink(link) {
      console.log('redirect',link);
    }
  }
});
