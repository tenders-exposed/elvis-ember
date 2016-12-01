import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  dropMenu: false,

  didInsertElement(){
    Ember.$("#main-navbar .dropdown-button").dropdown();
    Ember.$("#main-navbar .button-collapse").sideNav();
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
      this.get('router').transitionTo('welcome');
    },
    toggleMenu(){
      console.log('tring to hide the menu '+Ember.$(".menu-container").hasClass('hideMenu'));
      const jQMenuContainer = Ember.$(".menu-container");
      jQMenuContainer.toggleClass('hideMenu');
      jQMenuContainer.toggleClass('showMenu');

    }
  }
});
