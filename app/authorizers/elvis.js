import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from '@ember/utils';

export default OAuth2BearerAuthorizer.extend({
  tokenAttributeName: 'access_token',
  authorize(data, block) {
    let userToken          = data.access_token;
    if (!isEmpty(userToken)) {
      block('Authorization', `${userToken}`);
    }
  }
});
