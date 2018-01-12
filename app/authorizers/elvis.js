// import Ember from 'ember';
import OAuth2BearerAuthorizer from 'ember-simple-auth/authorizers/oauth2-bearer';

// const { isEmpty } = Ember;

export default OAuth2BearerAuthorizer.extend({
  // tokenAttributeName: 'authentication_token',
  // identificationAttributeName: 'email',
  // authorize(data, block) {
  //   let userToken          = data.authentication_token;
  //   let userIdentification = data.email;
  //   if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
  //     // const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
  //     block('X-User-Email', `${userIdentification}`);
  //     block('X-User-Token', `${userToken}`);
  //   }
  // }
});
