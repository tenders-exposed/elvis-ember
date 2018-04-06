import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ElvisAdapter from './elvis';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default ElvisAdapter.extend(DataAdapterMixin, {
  session: service(),
  host: `${ENV.APP.apiHost}`,
  namespace: `account`,
  authorizer: 'authorizer:elvis',

  token: computed('session.session.content.authenticated', function() {
    return this.get('session.session.content.authenticated.access_token');
  }),

  headers: computed('token', function() {
    return {
      'Authorization': this.get('token')
    };
  }),

  pathForType() {
    return '';
  },

  urlForFindRecord() {
    return this.buildURL();
  }
});
