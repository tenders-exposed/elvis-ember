import ActiveModelAdapter from 'active-model-adapter';
import ENV from "../config/environment";

var Adapter = ActiveModelAdapter.extend({
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
});

export default Adapter;
