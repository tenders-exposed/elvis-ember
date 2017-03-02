import Ember from 'ember';

const { Helper } = Ember;

export function dd(params/*, hash*/) {
  let [ rowData, col ] = params;
  return rowData[col];
}

export default Helper.helper(dd);
