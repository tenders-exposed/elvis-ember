import Ember from 'ember';
import numeral from 'numeral';

const { Helper } = Ember;
const defaultFormat = '0,0[.]00 a';

export function formatAmount(params/*, hash*/) {
  let [value, format] = params;
  let type = typeof value;
  if (type !== 'undefined' && type !== 'NaN' && type !== 'object' && type > 0) {
    return numeral(value)
      .format(format || defaultFormat)
      .toUpperCase();
  } else {
    return 'no data';
  }
}

export default Helper.helper(formatAmount);
