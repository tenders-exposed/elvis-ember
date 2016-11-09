import Ember from 'ember';

export default Ember.Component.extend({

  click(event) {
    if (event.target.classList.contains('fa-close')) {
      let { cid } = this;

      let removable = this.get('selectedCodes').findBy('id', cid);

      this.get('jsTree').send('deselectNode', removable);
      this.get('selectedCodes').removeObject(removable);
    }
  }
});
