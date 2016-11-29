import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  didInsertElement(){
    Ember.$("#main-navbar .dropdown-button").dropdown();
    Ember.$("#main-navbar .button-collapse").sideNav();
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
      this.get('router').transitionTo('welcome');
    }
  }
});
