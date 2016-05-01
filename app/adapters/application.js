import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';
// import ActiveModelAdapter from 'active-model-adapter';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}/api`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis'
});
