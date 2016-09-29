import Ember from 'ember';

export default Ember.Component.extend({

  click(event) {

    if (event.target.classList.contains('fa-close')) {
      let self = this;
      let { id } = self;

      Ember.$(`#tr-${id}`).toggleClass('hide');

      let removable = self.get('selectedCodes').findBy('id', id);

      console.log(self.get('selectedCodes'));
      self.get('selectedCodes').removeObject(removable);
    }
  }
});
