import Ember from 'ember';
import RangeSlider from 'ember-cli-nouislider/components/range-slider';

export default RangeSlider.extend({
  change(){
    console.log('fuck this');
  },

  didInsertElement() {
    // Ember.$('.noUi-handle-lower').prepend('span.left-year');
    // Ember.$('.noUi-handle-upper').prepend('span.right-year');
    Ember.$('span.left-year').appendTo('.noUi-handle-lower');
    Ember.$('span.right-year').appendTo('.noUi-handle-upper');
  },


  didUpdateAttrs() {
    let slider = this.get('slider');
    const softLimits = slider.get('range');
    slider.on('change', ()=>{
      let limits = slider.get('range');

      limits[0] = limits[0] < softLimits[0] && softLimits[0];
      limits[1] = limits[1] > softLimits[1] && softLimits[1];

      slider.set( limits);
    });
  },


});
