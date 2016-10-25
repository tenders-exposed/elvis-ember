import Ember from 'ember';

export default Ember.Component.extend({

  click(event) {

    if (event.target.classList.contains('fa-close')) {
      let self = this;
      let { cid } = self;

      Ember.$(`#tr-${cid}`).toggleClass('hide');

      let removable = self.get('selectedCodes').findBy('id', cid);

      console.log(self.get('selectedCodes'));
      self.get('selectedCodes').removeObject(removable);
    }
  }
});
