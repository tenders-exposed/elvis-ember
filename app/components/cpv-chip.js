import Ember from 'ember';

export default Ember.Component.extend({

  click() {
    let self = this;
    let code = self.code;
    let description = self.get('description');

    console.log(`Clicked on ${code}`);
      
    Ember.$(`#tr-${code}`).toggleClass('hide');

    // let removable;
    // self.get('selectedCodes').forEach(function(element) {
    //   console.log(element.code);
    //   if (element.code == code) {
    //     removable = element;
    //     return;
    //   }
    // });

    let removable = self.get('selectedCodes').findBy('code', code);

    // console.log(removable);
    self.get('selectedCodes').removeObject(removable);
    // console.log(self.get('selectedCodes'));
  }
});
