import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from '../config/environment';
import RSVP from 'rsvp';
import {
  merge,
  assign as emberAssign
} from '@ember/polyfills';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import { makeArray } from '@ember/array';

const assign = emberAssign || merge;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/account/login`,
  makeRequest(url, data, headers = {}) {
    headers['Content-Type'] = 'application/json';

    let body = `{
      "email": "${data.username}",
      "password": "${data.password}"
    }`;

    let options = {
      body,
      headers,
      method: 'POST'
    };

    let clientIdHeader = this.get('_clientIdHeader');
    if (!isEmpty(clientIdHeader)) {
      merge(options.headers, clientIdHeader);
    }

    return new RSVP.Promise((resolve, reject) => {
      fetch(url, options).then((response) => {
        response.text().then((text) => {
          try {
            let json = JSON.parse(text);
            if (!response.ok) {
              response.responseJSON = json;
              reject(response);
            } else {
              resolve(json);
            }
          } catch (SyntaxError) {
            response.responseText = text;
            reject(response);
          }
        });
      }).catch(reject);
    });
  },

  authenticate(identification, password, scope = [], headers = {}) {
    return new RSVP.Promise((resolve, reject) => {
      let data = { 'grant_type': 'password', username: identification, password };
      let serverTokenEndpoint = this.get('serverTokenEndpoint');
      let useResponse = this.get('rejectWithResponse');
      let scopesString = makeArray(scope).join(' ');
      if (!isEmpty(scopesString)) {
        data.scope = scopesString;
      }
      this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
        run(() => {
          response.access_token = response.accessToken;
          delete response.accessToken;
          if (!this._validate(response)) {
            reject('access_token is missing in server response');
          }

          let expiresAt = this._absolutizeExpirationTime(response['expires_in']);
          this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
          if (!isEmpty(expiresAt)) {
            response = assign(response, { 'expires_at': expiresAt });
          }

          resolve(response);
        });
      }, (response) => {
        run(null, reject, useResponse ? response : (response.responseJSON || response.responseText));
      });
    });
  },
});
