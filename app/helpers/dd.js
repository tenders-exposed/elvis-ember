import Helper from '@ember/component/helper';

export function dd(params/*, hash*/) {
  let [ rowData, col ] = params;
  return rowData[col];
}

export default Helper.helper(dd);
