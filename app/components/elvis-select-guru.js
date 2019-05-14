import EmberSelectGuru from 'ember-select-guru/components/ember-select-guru';
import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import { get } from '@ember/object';

export default EmberSelectGuru.extend({
  checkboxIsSelected: false,
  countriesChanged: observer('checkActors', function() {
    if (this.get('checkActors')) {
      let selected = _.cloneDeep(this.get('_value'));
      this.set('_value', []);
      let self = this;

      _.each(selected, (option) => {
        if (option.country && _.indexOf(self.get('countries'), option.country) >= 0) {
          this.get('_value').pushObject(option);
        }
        this.set('value', _.cloneDeep(this.get('_value')));
      });
      let onSelect = get(this, 'onSelect');
      onSelect(this.get('_value'));
      this.set('countActors', this.get('_value').length);
      this.set('checkActors', false);
    }
  }),

  removeValue(option) {
    this.get('_value').removeObject(option);
    this.set('countActors', this.get('_value').length);
    let onSelect = get(this, 'onSelect');
    onSelect(this.get('_value'));
  },
  actions: {
    onOptionCheck() {
      return;
    },
    onOptionClick(option) {
      let onSelect = get(this, 'onSelect');
      if (this.get('multiple')) {
        // handle multiple selection
        this.get('_value').pushObject(option);
        onSelect(this.get('_value'));

        this.set('countActors', this.get('_value').length);

        if (this.get('_options').length <= 1) {
          // then all options were selected .then reset queryTerm
          this.set('queryTerm', '');
          this.set('isExpanded', false);
        }
      } else {
        // handle single selection
        onSelect(option);
      }
    },
    onRemoveValueClick(option) {
      this.get('_value').removeObject(option);
      this.set('countActors', this.get('_value').length);
      let onSelect = get(this, 'onSelect');
      onSelect(this.get('_value'));

    },
    expandComponent() {
      if (!this.get('isExpanded')) {
        this.set('queryTerm', '');
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
