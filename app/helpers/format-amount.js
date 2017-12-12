import { helper } from "@ember/component/helper";
import numeral from 'numeral';

const defaultFormat = '0,0[.]00 a';
const unicodeFruits = [
  '🍓', '🍍', '🍋', '🍌', '🍇', '🍆', '🍉'
];

export function formatAmount(params/*, hash*/) {
  let [value, format, placeholder] = params;

  if (value) {
    return numeral(value)
      .format(format || defaultFormat)
      .toUpperCase();
  }

  if (placeholder) {
    return placeholder;
  }

  return unicodeFruits[Math.floor(Math.random() * unicodeFruits.length)];
}

export default helper(formatAmount);
