import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  classNames: ['body-network'],
  ajax: service(),
  store: service(),

  model(params, transition) {
    let { tab } = transition.params['network.show.details'];
    let { network_id } = transition.params['network.show'];
    let contractId = params.contract_id;
    let entityId = params.node_id;
    let { countries } = this.modelFor('network.show').get('query');

    let self = this;

    // console.log(`url request /networks/${network_id}/tenders/${contractId}`);
    return this.get('ajax')
      .request(`/networks/${network_id}/tenders/${contractId}`).then(
        (data) => {
          let results = data.tender;
          results.entityId = entityId;
          results.tab = tab;
          // let details = { 'yes': 'check', 'no': 'close', 'null': 'question' };

          results.isCoveredByGpa = results.isCoveredByGpa ? 'check' : 'close';
          results.isFrameworkAgreement = results.isFrameworkAgreement ? 'check' : 'close';
          results.isEuFunded = (typeof results.isEuFunded !== 'undefined')
            ? (results.isEuFunded ? 'check' : 'close') : 'question';

          results.selectionMethod = results.lots[0].selectionMethod;
          results.bidders = [];
          _.forEach(results.lots, function (lot) {
            // select only the winning bids
            let winningBids = _.filter(lot.bids, function (bid) {
              return bid.isWinning;
            });

            // retrieve the year of the first winning bid
            let TEDCANID = winningBids[0].TEDCANID;
            results.tedYear = TEDCANID.substring(0,4);
            results.tedNumber = TEDCANID.substring(11,TEDCANID.length);

            // @todo: with the observation that this is not the actual tender country from payload is the first country in the query.countries from query builder
            results.tedCountry = _.lowerCase(countries[0]);

            // add to bidders if unique
            _.forEach(winningBids, function (bid) {
              results.bidders = _.unionBy(results.bidders, bid.bidders, 'id');
            });
          });

          console.log('contract result', results);
          return results;
        }, (response) => {

          self.get('notifications').clearAll();
          _.forEach(response.errors, (error, index) => {
            self.get('notifications').error(`Error: ${index } ${error.title}`);
          });
        });
  },

  actions: {
    closeDetails() {
      this.transitionTo(
        'network.show.details',
        this.controllerFor('network.show.details').get('activeTab')
      );
    }
  }
});
