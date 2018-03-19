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
      let endpoint = this.get('endpoint');
      window.location = `${endpoint}/twitter`;
    },
    authenticateGithub() {
      let endpoint = this.get('endpoint');
      window.location = `${endpoint}/github`;
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
          this.set('loginVisible', false);
        });
    }
  }
});
