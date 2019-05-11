import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),

  init() {
    this._super(...arguments);
  },

  actions: {
    showRegister() {
      this.get('auth').showRegister();
    },
    showLogin() {
      this.get('auth').showLogin();
    },

    authenticateTwitter() {
      this.get('auth').authenticateTwitter();
    },
    authenticateGithub() {
      this.get('auth').authenticateGithub();
    },
    authenticate() {
      let email = this.get('email');
      let password = this.get('password');
      return this.get('auth')
                .authenticate(email, password)
                .then(() => {
                  this.get('auth').hideModal();
                });
    },
    register() {
      let email = this.get('email');
      let password = this.get('password');
      return this.get('auth')
                .register(email, password)
                .then(() => {
                  this.get('auth').hideModal();
                });
    }

  }
});
