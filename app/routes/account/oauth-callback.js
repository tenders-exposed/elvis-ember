import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

export default Route.extend({
  ajax: service(),
  session: service(),

  queryParams: {
    code: {
    },
    oauth_token: {
    },
    oauth_verifier: {
    }
  },
  model(params) {
    let service = 'twitter'; // default to Twitter
    if (params.code) {
      service = 'github'; // switch to GitHub
    }
    let endpoint = `${ENV.APP.apiHost}/account/login/${service}/callback`;
    let url = `${endpoint}?oauth_token=${params.oauth_token}&oauth_verifier=${params.oauth_verifier}`;

    return new RSVP.Promise((resolve, reject) => {
      fetch(
        url,
        {
          method: 'get',
          // mode: 'no-cors',
          // referrer: 'http://localhost:4200/account/login',
          // useFinalURL: true,
          credentials: 'include'
        }
      ).then((response) => {
        response.json().then((json) => {
          resolve(json);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  },
  setupController(controller, model) {
    controller.set('model', model);

    this.get('session')
      .authenticate('authenticator:application', model, null)
      .catch((reason) => this.set('errorMessage', reason.error || reason))
      .then((response) => {
        if (typeof response === 'undefined') {
          location.reload();
        }
        this.transitionTo('welcome');
      });
  }
});
