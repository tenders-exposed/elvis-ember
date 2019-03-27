import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  session: service('session'),
  dropMenu: false,

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
    }
  }
});
