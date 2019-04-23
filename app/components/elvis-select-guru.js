import EmberSelectGuru from 'ember-select-guru/components/ember-select-guru';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

export default EmberSelectGuru.extend({

  actions: {
    onOptionCheck(/* option */) {
      // console.log('onOptionCheck');
      return;
    },
    onOptionClick(option) {
      let onSelect = get(this, 'onSelect');
      if (this.get('multiple')) {
        // handle multiple selection

        this.get('_value').pushObject(option);
        onSelect(this.get('_value'));
        // get(this, '_onSelect')(get(this, '_value'));
      } else {
        // handle single selection
        onSelect(option);
      }
    },
    onRemoveValueClick(option) {
      let onSelect = get(this, 'onSelect');
      this.get('_value').removeObject(option);
      onSelect(this.get('_value'));
    },
    expandComponent() {
      if (!this.get('isExpanded')) {
        this._resetCurrentHighlight();
      }
      this.set('isExpanded', true);
      run.schedule('afterRender', this, function() {
        this.$('input').focus();
      });
    },
    willHideDropdown() {
      this.set('isExpanded', false);
    }
  }
});
