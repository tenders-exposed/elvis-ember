import Ember from 'ember';

export default Ember.Controller.extend({
  pizzas: [
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
  ]
});
