import Ember from 'ember';

const { Controller, A } = Ember;

export default Controller.extend({
  loaderText: '',
  loaderWords: A(),

  init() {
    this.get('loaderWords').pushObject('loading');
  }
});
