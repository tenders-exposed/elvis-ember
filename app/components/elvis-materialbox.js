import Component from '@ember/component';

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'style'],
  didInsertElement() {
    this.$().materialbox();
  }
});
