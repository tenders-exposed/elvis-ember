import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base'

const { isEmpty } = Ember;

export default BaseAuthorizer.extend({
  tokenAttributeName: 'authentication_token',
  identificationAttributeName: 'email',

  authorize(data, block) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const userToken          = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];
    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      // const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('X-User-Email', `${userIdentification}`);
      block('X-User-Token', `${userToken}`);
    } else {
      console.log(`userToken: ${userToken}`);
      console.log(`userIdentification: ${userIdentification}`);
    }
  }
});
