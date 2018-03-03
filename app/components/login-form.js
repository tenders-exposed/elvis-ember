import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Component.extend({
  session: service(),
  ajax: service(),
  endpoint: `${ENV.APP.apiHost}/account/login`,

  actions: {
    authenticateTwitter() {
      // this.get('ajax').request('/account/login/github')
      //   .then((response) => {
      //     console.log(response);
      //   });
      let endpoint = this.get('endpoint');
      window.location = `${endpoint}/twitter`;
      // return new RSVP.Promise((resolve, reject) => {
      //   fetch(`${endpoint}/twitter`, {
      //     mode: 'no-cors',
      //     redirect: 'follow'
      //   }).then((response) => {
      //     console.log(response);
      //     return false;
      //   }).catch(reject);
      // });
    },
    authenticateGithub() {
      // this.get('ajax').request('/account/login/github')
      //   .then((response) => {
      //     console.log(response);
      //   });
      let endpoint = this.get('endpoint');
      return new RSVP.Promise((resolve, reject) => {
        fetch(`${endpoint}/github`, { mode: 'no-cors' }).then((response) => {
          console.log(response);
          return false;
        }).catch(reject);
      });
    },
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session')
        .authenticate('authenticator:application', identification, password)
        .catch((reason) => this.set('errorMessage', reason.error || reason))
        .then((response) => {
          if (typeof response === 'undefined') {
            location.reload();
          }
        });
    }
  }
});
