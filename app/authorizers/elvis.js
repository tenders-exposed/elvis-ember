import Ember from 'ember';
// import BaseAuthorizer from 'ember-simple-auth/authorizers/base';
import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';

const { isEmpty } = Ember;

// export default BaseAuthorizer.extend({
export default DeviseAuthorizer.extend({
  tokenAttributeName: 'authentication_token',
  identificationAttributeName: 'email',
  authorize(data, block) {
    const userToken          = data.user['authentication_token'];
    const userIdentification = data.user['email'];
    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      // const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('X-User-Email', `${userIdentification}`);
      block('X-User-Token', `${userToken}`);
    } else {
      console.log('authorizer data: ', data['user']);
      console.log(`authorizer userToken: ${userToken}`);
      console.log(`authorizer userIdentification: ${userIdentification}`);
    }
  }
});
