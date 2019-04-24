import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  // stepId, name, wizardCurrentState.currentStep
  tagName: 'span',
  classNames: ['selected-option'],
  classNameBindings: ['name', 'isCompleted'],
  isCompleted: computed('wizardCurrentState.currentStep', function() {

    if (this.get('wizardCurrentState.currentStep') > this.get('stepId')) {
      return 'completed';
    } else {
      return 'disabled';
    }
  })
});
