import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';

export default DeviseAuthorizer.extend({
  tokenAttributeName: 'authentication_token',
  identificationAttributeName: 'email'
});
