import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement() {
    //Ember.$('.noUi-handle-lower').prepend('span.left-year');
    //Ember.$('.noUi-handle-upper').prepend('span.right-year');
    Ember.$('span.left-year').appendTo('.noUi-handle-lower');
    Ember.$('span.right-year').appendTo('.noUi-handle-upper');
  }
});
