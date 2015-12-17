import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement() {
    Em.$('form#register *').focus(function(){
      Em.$('div#inputPasswordContainer').fadeIn(300);
    });
    //Em.$('form#register').blur(function(){
    //  Em.$('div#inputPasswordContainer').fadeOut(300);
    //});
  },
});
