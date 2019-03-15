import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Service.extend({
  session: service(),
  ajax: service(),
  endpoint: `${ENV.APP.apiHost}/account/login`,

  init() {
    this._super(...arguments);
    $('#register-form').hide();
    $('#login-form').show();
  },
  showRegister() {
    $('#register-form').hide();
    $('#login-form').show();
  },
  showLogin() {
    $('#login-form').hide();
    $('#register-form').show();
  },
  authenticateTwitter() {
    let endpoint = this.get('endpoint');
    window.location = `${endpoint}/twitter`;
  },
  authenticateGithub() {
    let endpoint = this.get('endpoint');
    window.location = `${endpoint}/github`;
  },
  authenticate(identification, password) {
    return this.get('session')
      .authenticate('authenticator:application', identification, password)
      .catch((reason) => this.set('errorMessage', reason.error || reason))
      .then((response) => {
        if (typeof response === 'undefined') {
          location.reload();
        }
        this.set('loginVisible', false);
      });
  },
  register() {
    let self = this;
    return this.get('model').save().then(() => {
      self.notifications.clearAll();
      self.notifications.success('Done! Please check your inbox.', {
        autoClear: true
      });
      self.transitionToRoute('welcome');
    }).catch((response) => {
      this.set('errors', response);
      _.each(response.errors, function(error) {
        self.notifications.error(`${error.message}`, {
          autoClear: false
        });
      });
    });
  }
});
