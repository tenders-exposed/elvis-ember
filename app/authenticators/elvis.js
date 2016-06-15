import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ENV from '../config/environment';

const { RSVP, isEmpty, run } = Ember;

export default Base.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/${ENV.APP.apiNamespace}/users/sign_in`,

  restore(data) {
    let tokenAttribute = data.authentication_token;
    let identificationAttribute = data.email;

    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(tokenAttribute) && !isEmpty(identificationAttribute)) {
        resolve(data);
      } else {
        console.log('authenticator data: ', data);
        console.log('authenticator tokenAttribute: ', tokenAttribute);
        reject();
      }
    });
  },

  authenticate(identification, password) {
    return new RSVP.Promise((resolve, reject) => {
      let data = {
        user: {
          email: identification,
          password
        }
      };

      this.makeRequest(data).then(function(response) {
        run(null, resolve, response);
      }, function(xhr) {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  },

  invalidate() {
    return RSVP.resolve();
  },

  makeRequest(data) {
    let serverTokenEndpoint = this.get('serverTokenEndpoint');
    return Ember.$.ajax({
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
});
