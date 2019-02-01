import EmberSelectGuru from 'ember-select-guru/components/ember-select-guru';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

export default EmberSelectGuru.extend({

  actions: {
    onOptionCheck(option) {
      console.log('onOptionCheck');
    },
    onOptionClick(option) {
      if (this.get('multiple')) {
        // handle multiple selection
        console.log('onOptionClick multiple option', option);
        console.log('onOptionClick multiple _value', this.get('_value'));

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
      // this.set('queryTerm', 'ibm');
      // console.log('extended function');
      run.schedule('afterRender', this, function() {
        this.$('input').focus();
      });
    },
    willHideDropdown() {
      // console.log('willHideDropdown');
      this.set('isExpanded', false);
    }
  }
});
