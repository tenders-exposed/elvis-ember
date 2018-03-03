import Route from '@ember/routing/route';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

export default Route.extend({
  endpoint: `${ENV.APP.apiHost}/account/login/twitter/callback`,

  queryParams: {
    oauth_token: {
    },
    oauth_verifier: {
    }
  },
  model(params) {
    console.log('params', params);
    return new RSVP.Promise((resolve, reject) => {
      fetch(
        this.get('endpoint'),
        {
          method: 'get',
          mode: 'no-cors',
          qs: {
            oauth_token: params.oauth_token,
            oauth_verifier: params.oauth_verifier
          }
        }
      ).then((response) => {
        console.log(this.get('endpoint'));
        console.log(response);
      }).catch(reject);
    });
  },
  afterModel() {
    // this.transitionTo('welcome');
  }
});
