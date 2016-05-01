import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import ENV from '../config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/api/${ENV.APP.apiNamespace}/users/sign_in`
});
