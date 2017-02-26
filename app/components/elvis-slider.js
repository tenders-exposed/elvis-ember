import Ember from 'ember';

const { Component, $ } = Ember;

export default Component.extend({
  didInsertElement() {
    $('.slider').slider({
      full_width: true,
      indicators: false
    });
  }
});

