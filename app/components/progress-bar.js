import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  percent: 0,
  message: '',

  didUpdateAttrs() {
    let percent = this.get('percent');
    $('.progress-bar').animate({ left: `${percent}%` }, 5000);
  }

});
