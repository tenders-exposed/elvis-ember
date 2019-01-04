import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

export default Route.extend({
  ajax: service(),
  session: service(),
  endpoint: `${ENV.APP.apiHost}/account/login/twitter/callback`,

  queryParams: {
    oauth_token: {
    },
    oauth_verifier: {
    }
  },
  model(params) {
    // console.log('params', params);
    let url = `${this.get('endpoint')}?oauth_token=${params.oauth_token}&oauth_verifier=${params.oauth_verifier}`;
    let headers = {
      'Content-Type': 'application/json'
    };
    // return this.get('ajax').request(url, {
    // }).then((response) => {
    //   console.log(response);
    //   return response;
    // }, (error) => {
    //   console.log(error);
    // });
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
        // console.log(this.get('endpoint'));
        // console.log('response', response);
        // console.log('blob', response.blob());
        // console.log('text', response.text());
        response.json().then((json) => {
          resolve(json);
        });
      }).catch((error) => {
        // console.error('ERROR', error);
        reject(error);
      });
    });
  },
  setupController(controller, model) {
    // this.transitionTo('welcome');
    // console.log('model is', model);
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
