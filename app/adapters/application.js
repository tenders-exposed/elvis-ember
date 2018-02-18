import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ElvisAdapter from './elvis';

export default ElvisAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis'
});

