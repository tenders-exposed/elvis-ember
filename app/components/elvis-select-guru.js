import EmberSelectGuru from 'ember-select-guru/components/ember-select-guru';
import { run } from '@ember/runloop';

export default EmberSelectGuru.extend({

  actions: {
    onOptionCheck(/* option */) {
      // console.log('onOptionCheck');
      return;
    },
    onOptionClick(option) {
      if (this.get('multiple')) {
        // handle multiple selection

        this.get('_value').pushObject(option);
        this.attrs.onSelect(this.get('_value'));
      } else {
        // handle single selection
        this.attrs.onSelect(option);
      }
    },
    onRemoveValueClick(option) {
      this.get('_value').removeObject(option);
      this.attrs.onSelect(this.get('_value'));
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
