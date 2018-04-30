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

    return this.get('ajax')
      .request(`/networks/${network_id}/tenders/${contractId}`).then(
        (data) => {
          let results = data.tender;
          results.entityId = entityId;
          results.tab = tab;

          // labels
          results.isCoveredByGpa = (typeof results.isCoveredByGpa !== 'undefined')
            ? (results.isCoveredByGpa ? 'check' : 'close') : 'question';

          results.isFrameworkAgreement = (typeof results.isFrameworkAgreement !== 'undefined')
            ? (results.isFrameworkAgreement ? 'check' : 'close') : 'question';

          results.isEuFunded = (typeof results.isEUFunded !== 'undefined')
            ? (results.isEUFunded ? 'check' : 'close') : 'question';

          // from lots
          results.selectionMethod = results.lots[0].selectionMethod;
          results.bidders = [];
          _.forEach(results.lots, function(lot) {
            // select only the winning bids
            let winningBids = _.filter(lot.bids, function(bid) {
              return bid.isWinning;
            });

            // retrieve the year of the first winning bid
            let TEDCANID = (typeof results.TEDCANID !== 'undefined') ? results.TEDCANID : winningBids[0].TEDCANID;
            results.tedYear = TEDCANID.substring(0, 4);
            let tedIdParts = _.split(TEDCANID, '-');
            results.tedNumber = _.last(tedIdParts);

            // add to bidders if unique
            _.forEach(winningBids, function(bid) {
              results.bidders = _.unionBy(results.bidders, bid.bidders, 'id');
            });
          });

          // console.log('contract result', results);
          return results;
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
