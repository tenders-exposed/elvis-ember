import { helper } from '@ember/component/helper';

const defaultFormat = 'N/A';
const unicodeFruits = [
  '🍓', '🍍', '🍋', '🍌', '🍇', '🍆', '🍉'
];

export function formatEmpty(params) {
  let [value, format] = params;

  if ((typeof value == 'undefined') || value == '' || value == 'null' || value == null
    || (((typeof value == 'object') || (typeof value == 'array'))) && value.length == 0) {
    if (format) {
      return format;
    } else {
      return unicodeFruits[Math.floor(Math.random() * unicodeFruits.length)];
    }
  } else {
    return value;
  }
}

export default helper(formatEmpty);
