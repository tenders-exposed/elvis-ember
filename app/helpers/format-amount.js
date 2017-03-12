import Ember from 'ember';
import numeral from 'numeral';

const { Helper } = Ember;

export function formatAmount(params/*, hash*/) {
  let [value] = params,
      format = params[1] || '0.00 a';
  return numeral(value).format(format).toUpperCase();
}

export default Helper.helper(formatAmount);
