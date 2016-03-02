import Devise from 'ember-simple-auth/authenticators/devise'
import ENV from '../config/environment';

export default Devise.extend({
    serverTokenEndpoint: ENV.APP.apiHost + '/api/' + ENV.APP.apiNamespace + '/users/sign_in'
});
