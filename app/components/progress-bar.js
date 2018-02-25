import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  percent: 0,
  message: '',

  didUpdateAttrs() {
    $('.progress-bar').animate({left: this.get('percent')+'%' }, 5000);
  }

});
