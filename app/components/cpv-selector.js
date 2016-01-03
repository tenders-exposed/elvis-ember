import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  actions: {
    toggleModal() {
      this.get('targetObject').send('toggleModal');
    }
  }
});
