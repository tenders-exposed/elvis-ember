import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    register() {
      let _this = this;
      this.store.createRecord('user', {
        email: _this.get('fakeUser.email'),
        password: _this.get('fakeUser.password'),
        password_confirmation: _this.get('fakeUser.password_confirmation')
      }).save().then(function(response) {
          _this.notifications.clearAll();
          _this.notifications.success('Done! Please check your inbox.', {
            autoClear: true
          });
          console.log('Response: ', response);
          _this.transitionToRoute('index');
        }, function(response) {
          response.errors.forEach((error) => {
            _this.notifications.error(`Error: ${error.source.pointer.replace('/data/attributes/', '')} ${error.detail}`);
          });
          // Disabled for now, as we don't have JSON API error responses yet

          // console.error('There was a problem', response);
          // Object.keys(response.errors).map(function(value, index) {
          //   console.log(index);
          //   response.errors.each(function() {
          //     self.notifications.addNotification({
          //       message: this[0],
          //       type: 'error',
          //       autoClear: true,
          //       clearDuration: 2500
          //     });
          //   });
          // });
        }
      );
    },
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:elvis', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(function() {
        location.reload();
      });
    }
  }
});
