import Ember from 'ember';
import ENV from '../config/environment';
import AjaxService from 'ember-ajax/services/ajax';

export default Ember.Service.extend({
  host: ENV.APP.apiHost + '/api',
  namespace: ENV.APP.apiNamespace,
  // session: Ember.inject.service(),
  // headers: Ember.computed('session.authToken', {
  //   get() {
  //     let headers = {};
  //     const authToken = this.get('session.authToken');
  //     if (authToken) {
  //       headers['auth-token'] = authToken;
  //     }
  //     return headers;
  //   }
  // })
});
