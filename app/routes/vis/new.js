import Ember from 'ember';

export default Ember.Route.extend({
//  renderTemplate: function(){
//    this.render('graph/new');
//  }
  actions: {
    changedAction: function(value) {
      Ember.debug( "New slider value: %@".fmt( value ) );
    }
  }
});
