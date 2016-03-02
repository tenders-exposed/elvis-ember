import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    slidingAction(value) {
      // Ember.debug( "New slider value: %@".fmt( value ) );
      // this.controller.set('years', value[0]);
      this.controller.set('query.years', []);
      this.controller.get('query.years').push(value[0]);
      this.controller.get('query.years').push(value[1]);
      Ember.run.scheduleOnce('afterRender', function() {
        Ember.$('span.left-year').text(value[0]);
        Ember.$('span.right-year').text(value[1]);
      });
    },
    sendForm() {
      // console.log("Years: ", this.controller.years);
      this.transitionTo('network.show', 1);
    }
  }
});
