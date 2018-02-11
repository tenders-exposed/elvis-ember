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
import { warn } from '@ember/debug';

const assign = emberAssign || merge;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/account/login`,
  refreshAccessTokens: true,

  makeRequest(url, data, headers = {}, useget = false) {
    headers['Content-Type'] = 'application/json';

    if (!isEmpty(data.username)) {
      data.email = data.username;
      delete data.username;
    }

    // let body = keys(data).map((key) => {
    //   return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    // }).join('&');

    let options = {
      headers,
    };

    if (useget) {
      options.method = 'GET';
    } else {
      options.method = 'POST';
      options.body = JSON.stringify(data);
    }

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
              if (!isEmpty(json.refreshToken)) {
                json.refresh_token = json.refreshToken;
                json.access_token = json.accessToken;
                delete json.accessToken;
                delete json.refreshToken;
                resolve(json);
              }
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
      let data = { username: identification, password };
      let serverTokenEndpoint = this.get('serverTokenEndpoint');
      let useResponse = this.get('rejectWithResponse');
      let scopesString = makeArray(scope).join(' ');
      if (!isEmpty(scopesString)) {
        data.scope = scopesString;
      }
      this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
        run(() => {
          // response.refresh_token = response.refreshToken;
          // response.access_token = response.accessToken;
          // delete response.accessToken;
          // delete response.refreshToken;
          response.expires_in = 3600;
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

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      const now = (new Date()).getTime();
      const refreshAccessTokens = this.get('refreshAccessTokens');
      if (!isEmpty(data['expires_at']) && data['expires_at'] < now) {
        if (refreshAccessTokens) {
          this._refreshAccessToken(data['expires_in'], data['refresh_token']).then(resolve, reject);
        } else {
          reject();
        }
      } else {
        if (!this._validate(data)) {
          reject();
        } else {
          this._scheduleAccessTokenRefresh(data['expires_in'], data['expires_at'], data['refresh_token']);
          resolve(data);
        }
      }
    });
  },

  _refreshAccessToken(expiresIn, refreshToken) {
    let serverTokenEndpoint = `${ENV.APP.apiHost}/account/token/refresh`;
    let data = {};
    let headers = {
      'X-Refresh-Token': refreshToken
    };
    return new RSVP.Promise((resolve, reject) => {
      this.makeRequest(serverTokenEndpoint, data, headers, true).then((response) => {
        run(() => {
          expiresIn = response['expires_in'] || expiresIn;
          refreshToken = response['refresh_token'] || refreshToken;
          const expiresAt = this._absolutizeExpirationTime(expiresIn);
          const data = assign(response, { 'expires_in': expiresIn, 'expires_at': expiresAt, 'refresh_token': refreshToken });
          this._scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
          this.trigger('sessionDataUpdated', data);
          resolve(data);
        });
      }, (response) => {
        warn(`Access token could not be refreshed - server responded with ${response.responseJSON}.`, false, { id: 'ember-simple-auth.failedOAuth2TokenRefresh' });
        reject();
      });
    });
  },
});
