import DS from 'ember-data';
import ENV from "../config/environment";

 var Adapter = DS.ActiveModelAdapter.extend({
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
});

export default Adapter;
