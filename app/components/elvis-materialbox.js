import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src'],
  didInsertElement() {
    this.$().materialbox();
  }
});
