/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'elvis-ember',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      'ember-cli-notifications': {
          includeFontAwesome: true
      },
    }
  };

  if (environment === 'development') {
    // ENV.APP.apiHost = 'http://toto.tenders.exposed/api';
    ENV.APP.apiHost = 'https://api.elvis.tenders.exposed/api';
    ENV.APP.apiNamespace = 'v1';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'staging') {
    ENV.APP.apiHost = 'https://api.elvis.tenders.exposed/api';
    ENV.APP.apiNamespace = 'v1';

  }

  if (environment === 'production') {
    ENV.APP.apiHost = 'https://api.elvis.tenders.exposed/api';
    ENV.APP.apiNamespace = 'v1';

  }
  ENV['ember-simple-auth'] = {
    authenticationRoute: 'welcome'
  };

  // ENV['ember-simple-auth'] = {
  //   // authorizer: 'simple-auth-authorizer:devise',
  //   // crossOriginWhitelist: ['*'],
  //   // tokenAttributeName: 'token',
  //   // identificationAttributeName: 'email',
  //   authenticationRoute: ENV.APP.apiHost + '/api/' + ENV.APP.apiNamespace + '/users/sign_in'
  // };
  ENV.contentSecurityPolicy = {
    'default-src': "'self' http://api.elvis.tenders.exposed http://toto.tenders.exposed",
    'child-src': "blob: * 'self'",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval' http://api.elvis.tenders.exposed http://toto.tenders.exposed",
    'font-src': "'self' http://fonts.gstatic.com",
    'connect-src': "'self' * http://192.168.0.111:3000 http://0.0.0.0:3000 https://api.mixpanel.com http://localhost:3000 http://localhost:35729 blob: http://api.elvis.tenders.exposed http://toto.tenders.exposed",
    'img-src': "'self' 'unsafe-inline' 'unsafe-eval' data: *",
    'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com",
    'media-src': "'self'",
    'report-uri': "http://localhost:4200"
  };

  return ENV;
};
