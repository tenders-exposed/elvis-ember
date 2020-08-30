import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';

export default Controller.extend({
  activeTabDetails: 'contracts',
  activeTabbuyer: 'contracts',
  params: {},
  networkQuery: {},

  limitContractsPage: [
    {'value': 5, 'label': 5},
    {'value': 10, 'label': 10},
    {'value': 15, 'label': 15},
  ],

  limitPage: 5,

  limitPageObserver: observer('limitPage', function() {
    console.log('limit page Changed', this.get('limitPage'));
    this.get('target').send('resetLimitPage');
  }),

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
