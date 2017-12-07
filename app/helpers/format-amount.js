import Ember from 'ember';
import numeral from 'numeral';

const { Helper } = Ember;
const defaultFormat = '0,0[.]00 a';

export function formatAmount(params/*, hash*/) {
  let [value, format] = params;
  let formatedValue = 'N/A';
  if((typeof value !== 'undefined') && value !== '') {
    formatedValue = numeral(value)
      .format(format || defaultFormat)
      .toUpperCase();
  }
  return formatedValue;
}

export default Helper.helper(formatAmount);
