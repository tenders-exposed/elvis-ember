import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
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
