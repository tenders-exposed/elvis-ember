import Ember from 'ember';

export default Ember.Controller.extend({
  loaderText: '',
  loaderWords: Ember.A(),
  
  init() {
    this.get('loaderWords').pushObject('loading');
  }
});
