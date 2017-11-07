import Ember from 'ember';

const { Component, inject, $ } = Ember;

export default Component.extend({
  session: inject.service('session'),
  dropMenu: false,

  loginVisible: false,

  didInsertElement() {
    $('#main-navbar .dropdown-button').dropdown();
    $('#main-navbar .button-collapse').sideNav();
  },

  actions: {
    toggleLoginModal() {
      this.set(
        'loginVisible',
        !(this.get('loginVisible'))
      );
    },
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
