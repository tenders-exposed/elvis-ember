import Ember from 'ember';
import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ElvisAdapter from './elvis';

const { inject, computed } = Ember;

export default ElvisAdapter.extend(DataAdapterMixin, {
  session: inject.service(),
  host: `${ENV.APP.apiHost}`,
  namespace: `account`,
  authorizer: 'authorizer:elvis',

  token: computed('session.session.content.authenticated', function() {
    return this.get('session.session.content.authenticated.access_token');
  }),

  headers: Ember.computed('token', function() {
    console.log('token', this.get('token'));
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
