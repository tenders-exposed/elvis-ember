import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent() {
    // Em.$(document).ready(function(){
    //   Em.$("div#network-container").height(window.innerHeight);
    // });
    // Em.$(window).resize(function() {
    //   Em.$("div#network-container").height(window.innerHeight);
    // });
  }
});
