import { helper } from '@ember/component/helper';
import numeral from 'numeral';

const defaultFormat = '0,0[.]00 a';
const unicodeFruits = [
  '🍓', '🍍', '🍋', '🍌', '🍇', '🍆', '🍉'
];

export function formatAmount(params/*, options*/) {
  let [value, format, placeholder] = params;

  if (value !== 'undefined') {
    if (value == 0 || value == '0') {
      return 0;
    } else {
      return numeral(value)
        .format(format || defaultFormat)
        .toUpperCase();
    }
  }

  if (placeholder) {
    return placeholder;
  }

  return unicodeFruits[Math.floor(Math.random() * unicodeFruits.length)];
}

export default helper(formatAmount);
