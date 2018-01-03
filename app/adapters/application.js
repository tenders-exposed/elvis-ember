import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis'
});
