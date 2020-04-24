import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  actions: {
    onClick() {
      console.log('trying to close loading', this.get('action'));
      //this.sendAction('action');
      /*this.transitionToRoute('network.show');*/
      /*this.transitionTo('network.show.details',
        this.controllerFor('network.show.details').get('activeTab'));*/
    }

  }
});