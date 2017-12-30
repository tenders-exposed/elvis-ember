import Ember from 'ember';
import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ElvisAdapter from './elvis';

export default ElvisAdapter.extend(DataAdapterMixin, {
  me: Ember.inject.service(),
  host: `${ENV.APP.apiHost}`,
  namespace: `account`,
  authorizer: 'authorizer:elvis',

  headers: Ember.computed('me.access_token', function() {
    return {
      'Authorization': this.get('me.access_token')
    };
  }),

  pathForType() {
    return '';
  },

  urlForFindRecord() {
    return this.buildURL();
  }
});
