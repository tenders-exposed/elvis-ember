import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  resizeDetails() {
    this.$('div#network-container').parent().height(this.innerHeight);
  },
  didInsertElement() {
    this.$(document).ready(function() {
      this.resizeDetails();
    });
    this.$(window).resize(function() {
      this.resizeDetails();
    });
  }
});
