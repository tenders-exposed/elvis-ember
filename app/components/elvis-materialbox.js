import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'style'],
  didInsertElement() {
    this.$().materialbox();
  }
});
