import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from '@ember/utils';

export default OAuth2BearerAuthorizer.extend({
  tokenAttributeName: 'access_token',
  // identificationAttributeName: 'email',
  authorize(data, block) {
    let userToken          = data.access_token;
    let userIdentification = data.email;
    console.log('data', data);
    console.log('block', block);
    if (!isEmpty(userToken)) {
      // const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('Authorization', `${userToken}`);
    }
  }
});
