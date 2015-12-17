import Ember from 'ember';

export default Ember.Controller.extend({
  country_select2: [
    {
      id: 1,
      text: 'one',
      description: 'one description'
    },
    {
      id: 2,
      text: 'two',
      description: 'one description'
    },
    {
      id: 3,
      text: 'three',
      description: 'one description'
    },
  ],
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
      Ember.debug( "New select value: %@".fmt( value ) );
    }
  }
});
