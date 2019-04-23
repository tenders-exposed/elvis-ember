import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Service.extend({
  session: service(),
  ajax: service(),
  store: service(),
  notifications: service('notification-messages'),
  endpoint: `${ENV.APP.apiHost}/account/login`,
  loginVisible: false,

  init() {
    this._super(...arguments);
  },
  didInsertElement() {
    this._super(...arguments);
  },
  showRegister() {
    $('#register-form').toggleClass('hide');
    $('#login-form').toggleClass('hide');
  },
  showLogin() {
    $('#login-form').toggleClass('hide');
    $('#register-form').toggleClass('hide');
  },
  hideModal() {
    this.set('loginVisible', false);
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
        this.hideModal();
      });
  },
  register(email, password, password_confirmation) {
    let self = this;
    let user = this.get('store').createRecord('user', {
      email,
      password,
      password_confirmation
    });
    self.get('notifications').clearAll();
    return user.save().then(() => {
      self.get('notifications').success('Done! Please check your inbox.', {
        autoClear: true
      });
      self.transitionToRoute('welcome');
    }).catch((response) => {
      _.each(response.errors, function(error) {
        self.get('notifications').error(`${error.message}`, {
          autoClear: false
        });
      });
    }).then((response) => {
      return response;
    });
  }
});
