import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement() {
    Ember.$('form#register *').focus(function() {
      Ember.$('div#inputPasswordContainer').fadeIn(300);
    });
    // Em.$('form#register').blur(function(){
    //   Em.$('div#inputPasswordContainer').fadeOut(300);
    // });
  }
});
