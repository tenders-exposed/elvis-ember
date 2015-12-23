import Ember from 'ember';

export default Ember.Controller.extend({
  country_select: [
    {
      name: 'one',
      description: 'one description'
    },
    {
      name: 'two',
      description: 'one description'
    },
    {
      name: 'three',
      description: 'one description'
    },
  ],
  actions: {
    onSelectEvent(value) {
      this.set('values', values);
      console.log( "New select value: ", value);
    }
  }
});
