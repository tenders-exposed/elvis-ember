import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}/api`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis'
});
