import Ember from 'ember';
/* import { raw } from 'ic-ajax'; */

export default Ember.Route.extend({
  // queryParams: {
  //   reset_password_token: {
  //   }
  // },
  actions: {
    deviseSendReset(email, password, passwordConfirmation, params) {
      console.log('params', params);
      console.log('queryParams', this.queryParams);
      // var reset_password_token = this.controller.reset_password_token;
      // var req = raw({
      //   type: 'PUT',
      //   url: '/users/password',
      //   data: { "user": { "email": email, "password": password, "password_confirmation": password_confirmation, "reset_password_token": reset_password_token } }
      //   //,
      //   //dataType: 'json'
      // });
      // var self=this;
      // req.then(function(result){
      //     console.log('Response from Rails', result.response);
      //     self.notifications.addNotification({
      //       message: 'Your password was updated!',
      //       type: 'success'
      //     });
      //     self.controller.transitionToRoute('login');
      //   },
      //   function(response) {
      //     console.error('There was a problem: ', response);
      //     self.notifications.addNotification({
      //       message: 'Oops, something bad happened: ' + JSON.parse(response.jqXHR.responseText).errors[0],
      //       type: 'error'
      //     });
      //   }
      // );
    }
  }
});
