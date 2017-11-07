import Ember from 'ember';
import Component from '@ember/component';

const { inject } = Ember;

export default Component.extend({
  session: inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session')
        .authenticate('authenticator:elvis', identification, password)
        .catch((reason) => this.set('errorMessage', reason.error || reason))
        .then((response) => {
          if (typeof response === 'undefined') {
            location.reload();
          }
        });
    }
  }
});
