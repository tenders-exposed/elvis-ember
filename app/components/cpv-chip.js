import Ember from 'ember';

export default Ember.Component.extend({
  
  click() {
    let self = this;
    let code = self.get('code');
    let description = self.get('description');

    console.log(`Clicked on ${code}`);
      
    Ember.$(`#tr-${code}`).toggleClass('hide');

    let removable = self.get('selectedCodes').filterBy('code', code);
    console.log(self.get('selectedCodes'));
    self.get('selectedCodes').removeObject(removable);
    console.log(self.get('selectedCodes'));
  }
});
