import Ember from 'ember';

export default Ember.Controller.extend({
  queryCtl: Ember.inject.controller('network.query'),
  query: Ember.computed.reads('queryCtl.query'),
  beforeModel() {
    console.log('query: ', this.get('query'));
  }
});
