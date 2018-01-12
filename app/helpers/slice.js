import Helper from '@ember/component/helper';

export function slice(params/*, hash*/) {
  let [items, from, len] = params;
  let to;
  to = len ? (from + len) : items.length;
  return _.slice(items, from, to);
}
export default Helper.helper(slice);
