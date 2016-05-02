import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: 'ember-select-guru__option',
  classNameBindings: ['current:is-active'],
  current: computed('currentHighlight', 'index', function() {
    return this.get('currentHighlight') === this.get('index');
  }),
  click() {
    console.log(this.get('option'));

    // Hack for GB = UK, because TED data...
    if (this.get('option.key') === 'UK') {
      this.set('option.name', 'United Kingdom');
      this.sendAction('onClick', this.get('option'));
    } else {
      this.sendAction('onClick', this.get('option'));
    }
  }
});
