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
    this.set('option.key', this.get('option.x_slug_id'));

    let type = this.get('option.type');
    if (type === 'procuring_entity') {
      this.set('option.type', 'procurer');
    } else {
      this.set('option.type', type);
    }
  },
  click() {
    this.sendAction('onClick', this.get('option'));
  }
});
