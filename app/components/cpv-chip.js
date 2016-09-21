import Ember from 'ember';

export default Ember.Component.extend({

  click(event) {

    if (event.target.classList.contains('fa-close')) {
      let self = this;
      let { code } = self;

      Ember.$(`#tr-${code}`).toggleClass('hide');

      let removable = self.get('selectedCodes').findBy('code', code);

      self.get('selectedCodes').removeObject(removable);
    }
  }
});
