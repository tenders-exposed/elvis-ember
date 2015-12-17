import Ember from 'ember';

export default Ember.Route.extend({
//  renderTemplate: function(){
//    this.render('graph/new');
//  }
  actions: {
    changedAction(value) {
      Ember.debug( "New slider value: %@".fmt( value ) );
    }
  }
});
