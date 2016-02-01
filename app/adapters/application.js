import ActiveModelAdapter from 'active-model-adapter';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(ActiveModelAdapter, {
  host: ENV.APP.apiHost + '/api',
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:devise',
});
