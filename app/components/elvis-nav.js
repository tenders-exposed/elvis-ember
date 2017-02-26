import Ember from 'ember';

const { Component, inject, $ } = Ember;

export default Component.extend({
  session: inject.service('session'),
  dropMenu: false,

  didInsertElement() {
    $('#main-navbar .dropdown-button').dropdown();
    $('#main-navbar .button-collapse').sideNav();
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
      this.get('router').transitionTo('welcome');
    },
    toggleMenu() {
      let jQMenuContainer = $('.menu-container');
      jQMenuContainer.toggleClass('hideMenu');
      jQMenuContainer.toggleClass('showMenu');

    }
  }
});
