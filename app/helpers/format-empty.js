import Ember from 'ember';

const { Helper } = Ember;

const defaultFormat = 'N/A';

export function formatEmpty(params) {
  let [value, format] = params;

  format = format ? format : defaultFormat;
  if ((typeof value == 'undefined') || value == '' || value == 'null' || value == null) {
    return format;
  } else {
    return value;
  }
}

export default Helper.helper(formatEmpty);
