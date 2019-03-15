import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    authenticateTwitter() {
      let endpoint = this.get('endpoint');
      window.location = `${endpoint}/twitter`;
    },
    authenticateGithub() {
      let endpoint = this.get('endpoint');
      window.location = `${endpoint}/github`;
    },
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      return this.get('session')
        .authenticate('authenticator:application', identification, password)
        .catch((reason) => this.set('errorMessage', reason.error || reason))
        .then((response) => {
          if (typeof response === 'undefined') {
            location.reload();
          }
          this.set('loginVisible', false);
        });
    }
  }
});
