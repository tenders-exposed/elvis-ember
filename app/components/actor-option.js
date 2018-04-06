import Component from '@ember/component';
import { computed } from '@ember/object';

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
    if (type === 'buyer') {
      this.set('option.type', 'buyer');
    } else {
      this.set('option.type', type);
    }
  },
  click() {
    this.sendAction('onClick', this.get('option'));
  }
});
