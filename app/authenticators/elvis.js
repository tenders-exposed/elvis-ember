import Ember from 'ember';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from '../config/environment';

const { RSVP, isEmpty, run, $ } = Ember;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/auth/login`,

  authenticate(identification, password) {
    return new RSVP.Promise((resolve, reject) => {
      let data = {
        email: identification,
        password
      };

      this.makeRequest(data).then(function(response) {
        run(null, resolve, response);
      }, function(xhr) {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  },

  makeRequest(data) {
    let serverTokenEndpoint = this.get('serverTokenEndpoint');
    return $.ajax({
      url:      serverTokenEndpoint,
      type:     'POST',
      // dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      beforeSend(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }

  // restore(data) {
  //   let tokenAttribute = data.authentication_token;
  //   let identificationAttribute = data.email;

  //   return new RSVP.Promise((resolve, reject) => {
  //     if (!isEmpty(tokenAttribute) && !isEmpty(identificationAttribute)) {
  //       resolve(data);
  //     } else {
  //       reject();
  //     }
  //   });
  // },
  //
  // authenticate(identification, password) {
  //   return new RSVP.Promise((resolve, reject) => {
  //     let data = {
  //       user: {
  //         email: identification,
  //         password
  //       }
  //     };

  //     this.makeRequest(data).then(function(response) {
  //       run(null, resolve, response);
  //     }, function(xhr) {
  //       run(null, reject, xhr.responseJSON || xhr.responseText);
  //     });
  //   });
  // },

  // invalidate() {
  //   return RSVP.resolve();
  // },

  // makeRequest(data) {
  //   let serverTokenEndpoint = this.get('serverTokenEndpoint');
  //   return $.ajax({
  //     url:      serverTokenEndpoint,
  //     type:     'POST',
  //     // dataType: 'json',
  //     contentType: 'application/json',
  //     data: JSON.stringify(data),
  //     beforeSend(xhr, settings) {
  //       xhr.setRequestHeader('Accept', settings.accepts.json);
  //     }
  //   });
  // }
});
