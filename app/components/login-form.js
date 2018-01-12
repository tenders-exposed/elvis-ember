import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session')
        .authenticate('authenticator:application', identification, password)
        .catch((reason) => this.set('errorMessage', reason.error || reason))
        .then((response) => {
          if (typeof response === 'undefined') {
            location.reload();
          }
        });
    }
  }
});
