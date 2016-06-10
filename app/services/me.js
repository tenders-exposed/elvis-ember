import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  init() {
    this.set('data', Ember.computed('session.session.content.authenticated', function(){
     return this.get('session.session.content.authenticated');
    }));
  }
});
