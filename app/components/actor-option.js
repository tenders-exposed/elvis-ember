import Component from '@ember/component';
import { computed } from '@ember/object';
import { set as EmberSet } from '@ember/object';

export default Component.extend({
  classNames: 'ember-select-guru__option __guru',
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

  checkboxSwitch() {
    if (this.get('option.checked')) {
      EmberSet(this, 'option.checked', false);
    } else {
      EmberSet(this, 'option.checked', true);
    }
  },
  actions: {
    clickOption() {
      this.sendAction('onClick', this.get('option'));
    },
    clickCheckBox() {
      this.checkboxSwitch();
    }
  }

});
