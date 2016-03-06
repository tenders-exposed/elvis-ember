// import ActiveModelAdapter from 'active-model-adapter';
import DS from 'ember-data';
//import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: ENV.APP.apiHost + '/api',
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:devise',
});
