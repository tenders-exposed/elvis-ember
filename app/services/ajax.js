import Ember from 'ember';
import ENV from '../config/environment';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  host: `${ENV.APP.apiHost}/api/${ENV.APP.apiNamespace}`,
  trustedHosts: [
    '/.*/',
    'localhost',
    'elvis.tenders.exposed',
    'db1.tenders.exposed'
  ],
  //session: Ember.inject.service(),
  //headers: Ember.computed('session.authToken', {
  //  get() {
  //    let headers = {};
  //    const userToken          = this.get('session.session.content.authenticated.authentication_token');
  //    const userIdentification = this.get('session.session.content.authenticated.email');
  //    if (authToken) {
  //      block('X-User-Email', `${userIdentification}`);
  //      block('X-User-Token', `${userToken}`);
  //    }
  //    console.log(`headers: ${headers.userToken}`);
  //    return headers;
  //  }
  //})
});
