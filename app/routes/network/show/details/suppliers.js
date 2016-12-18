import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'details' });
  },
  activate(){
    console.log(" *in supplier");
  }
});