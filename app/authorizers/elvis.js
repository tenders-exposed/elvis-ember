import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from '@ember/utils';

export default OAuth2BearerAuthorizer.extend({
  tokenAttributeName: 'access_token',
  // identificationAttributeName: 'email',
  authorize(data, block) {
    let userToken          = data.access_token;
    let userIdentification = data.email;
    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      // const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('Authorization', `${userToken}`);
    }
  }
});
