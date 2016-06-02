import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DS from 'ember-data';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: `${ENV.APP.apiHost}`,
  namespace: ENV.APP.apiNamespace,
  authorizer: 'authorizer:elvis',

  // ajaxError: function(jqXHR) {
  //   var error = this._super(jqXHR);
  //   if (jqXHR && jqXHR.status === 422) {
  //     var response = Ember.$.parseJSON(jqXHR.responseText),
  //         errors = {};

  //     if (response.errors !== undefined) {
  //       var jsonErrors = response.errors;
  //       Ember.EnumerableUtils.forEach(Ember.keys(jsonErrors), function(key) {
  //         errors[Ember.String.camelize(key)] = jsonErrors[key];
  //       });
  //     }
  //     return new DS.InvalidError(errors);
  //   } else {
  //     return error;
  //   }
  // }
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

