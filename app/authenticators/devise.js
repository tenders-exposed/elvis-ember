import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import ENV from '../config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/api/${ENV.APP.apiNamespace}/users/sign_in`,
  // authenticate(identification, password) {
  //   return new Promise((resolve, reject) => {
  //     const { resourceName, identificationAttributeName } = this.getProperties('resourceName', 'identificationAttributeName');
  //     const data         = {};
  //     data[resourceName] = { password };
  //     data[resourceName][identificationAttributeName] = identification;

  //     return this.makeRequest(data).then(
  //       (response) => run(null, resolve, response),
  //       (xhr) => run(null, reject, xhr.responseJSON || xhr.responseText)
  //     );
  //   });
  // },
});
