import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    this.$('.slider').slider({
      full_width: true,
      indicators: false
    });
  }
});

