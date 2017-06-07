import Ember from 'ember';
import numeral from 'numeral';

const { Helper } = Ember;
const defaultFormat = '0,0[.]00 a';

export function formatAmount(params/*, hash*/) {
  let [value, format] = params;
  return numeral(value)
    .format(format || defaultFormat)
    .toUpperCase();
}

export default Helper.helper(formatAmount);
