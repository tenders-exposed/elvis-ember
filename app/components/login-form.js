import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

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
      /* let { identification, password } = this.getProperties('identification', 'password'); */
      let identification = this.get('auth').current_user.identification;
      let password = this.get('auth').current_user.password;
      console.log(identification, password);
      this.get('auth').authenticate(identification, password);
    },
    register() {
      this.get('auth').register();
    }

  }
});
