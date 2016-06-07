import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis',

  handleResponse(status, headers, payload, requestData) {
    if (this.isSuccess(status, headers, payload)) {
      return payload;
    } else if (this.isInvalid(status, headers, payload)) {
      // return payload.errors;
      // console.log(payload);
      return payload;
    }
  }
});

