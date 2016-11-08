import Ember from 'ember';
import RangeSlider from 'ember-cli-nouislider/components/range-slider';

export default RangeSlider.extend({

  didInsertElement() {
    // Ember.$('.noUi-handle-lower').prepend('span.left-year');
    // Ember.$('.noUi-handle-upper').prepend('span.right-year');
    Ember.$('span.left-year').appendTo('.noUi-handle-lower');
    Ember.$('span.right-year').appendTo('.noUi-handle-upper');
  },

  didRender(){

    const slider = this.get('slider');

    slider.on('change', (value)=>{

      const start = this.get('start');
      if(value[0] < start[0]){
        value[0] = start[0];
      }
      if(value[1] > start[1]) {
        value[1] = start[1];
      }
      // limits[0] = limits[0] < softLimits[0] && softLimits[0];
      // limits[1] = limits[1] > softLimits[1] && softLimits[1];

      slider.set( value);

      return false;
    });
  }
});
