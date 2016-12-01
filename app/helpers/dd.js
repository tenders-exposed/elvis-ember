import Ember from 'ember';

export function dd(params/*, hash*/) {
  let rowData = params[0];
  let col = params[1];
  return rowData[col];
}

export default Ember.Helper.helper(dd);
