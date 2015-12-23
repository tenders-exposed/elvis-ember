import Ember from 'ember';
import RangeSlider from 'ember-cli-nouislider/components/range-slider';

export default RangeSlider.extend({
  start: [2004, 2012],
  actions: {
    changedAction(value) {
      Ember.debug( "New slider value: %@".fmt( value ) );
    }
  }
});
