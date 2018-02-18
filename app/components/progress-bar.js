import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  percent: 0,
  message: '',

  didUpdateAttrs() {
    console.log('progres percent ', this.get('percent'));
    $('.progress-bar').animate({left: this.get('percent')+'%' }, 5000);
  }

});
