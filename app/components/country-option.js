import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: 'ember-select-guru__option',
  classNameBindings: ['current:is-active'],
  current: computed('currentHighlight', 'index', function() {
    return this.get('currentHighlight') === this.get('index');
  }),
  init() {
    this._super(...arguments);
    this.set('option.key', this.get('option.id'));
    this.set('option.name', this.get('option.text'));
  },
  click() {
    // Hack for GB = UK, because TED data...
    if (this.get('option.id') === 'UK') {
      this.set('option.name', 'United Kingdom');
      this.sendAction('onClick', this.get('option'));
    } else {
      this.sendAction('onClick', this.get('option'));
    }
  }
});
