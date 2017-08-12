import Ember from 'ember';
import ENV from '../config/environment';
import AjaxService from 'ember-ajax/services/ajax';

const { computed, inject } = Ember;

export default AjaxService.extend({
  host: `${ENV.APP.apiHost}/${ENV.APP.apiNamespace}`,
  me: computed('session.session.content.authenticated', function() {
    return this.get('session.session.content.authenticated');
  }),
  session: inject.service(),
  headers: computed('session.session.content.authenticated', function() {
    let userToken = this.get('session.session.content.authenticated.authentication_token');
    let userIdentification = this.get('session.session.content.authenticated.email');
    return {
      'Content-Type': 'application/json',
      'X-User-Email': `${userIdentification}`,
      'X-User-Token': `${userToken}`
    };
  }),

  trustedHosts: [
    '/.*/',
    'localhost',
    'elvis.tenders.exposed',
    'db1.tenders.exposed'
  ]

  // // TODO: Not sure we still need this, will keep around for a while
  // session: Ember.inject.service(),
  // headers: Ember.computed('session.authToken', {
  //   get() {
  //     let headers = {};
  //     const userToken          = this.get('session.session.content.authenticated.authentication_token');
  //     const userIdentification = this.get('session.session.content.authenticated.email');
  //     if (authToken) {
  //       block('X-User-Email', `${userIdentification}`);
  //       block('X-User-Token', `${userToken}`);
  //     }
  //     console.log(`headers: ${headers.userToken}`);
  //     return headers;
  //   }
  // })
});
