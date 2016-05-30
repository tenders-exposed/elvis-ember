import Ember from 'ember';
import RangeSlider from 'ember-cli-nouislider/components/range-slider';

export default RangeSlider.extend({
  start: [2004, 2007],
  
  didInsertElement() {
    // Ember.$('.noUi-handle-lower').prepend('span.left-year');
    // Ember.$('.noUi-handle-upper').prepend('span.right-year');
    Ember.$('span.left-year').appendTo('.noUi-handle-lower');
    Ember.$('span.right-year').appendTo('.noUi-handle-upper');
  },
  
  actions: {
    changedAction(value) {
      Ember.debug('New slider value: %@'.fmt(value));
    }
  }
});
