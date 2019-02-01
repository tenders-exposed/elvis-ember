import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  clickOutEventNamespace: 'el-popup',
  classNames: 'ember-select-guru__dropdown',

  didInsertElement() {
    $(document).bind(
      this.get('_clickOutEventName'),
      { component: this },
      run.bind(this, this.clickoutHandler)
    );
  },

  willDestroyElement() {
    $(document).unbind(
      this.get('_clickOutEventName')
    );
  },

  _willHideDropdown() {
    this.sendAction('willHideDropdown');
  },

  clickoutHandler(event) {

    if (($().parent().children('.ember-select-guru__trigger').has(event.target).length > 0) ||
      ($().parent().children('.ember-select-guru__trigger')[0] === event.target) ||
      (event.target.className.indexOf('__guru') != -1)
    ) {
      // console.log('elvis-select-dropdown clickoutHandler NO', this.$('.ember-select-guru__option .actor-option'));
      return;
    } else {
      // console.log('elvis-select-dropdown clickoutHandler YES', this.$('.ember-select-guru__option .actor-option'));
      run(() => {
        this._willHideDropdown();
      });
    }
  },

  _clickOutEventName: computed('clickOutEventNamespace', function() {
    return `
      click.${this.get('clickOutEventNamespace')}.${this.get('elementId')}
    `;
  })
});
