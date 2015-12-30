import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    deviseSendRecover: function(email) {
      console.log(email);
      //var req = raw({
      //  type: 'POST',
      //  url: '/users/password',
      //  data: { "user": { "email": email } }
      //  //,
      //  //dataType: 'json'
      //});
      //var self=this;
      //req.then(function(result){
      //    console.log('Response from Rails', result.response);
      //    self.notifications.addNotification({
      //      message: 'Password reset instructions were sent to your email address.',
      //      type: 'success'
      //    });
      //    self.controller.transitionToRoute('login');
      //  },
      //  function(response) {
      //    console.error('There was a problem: ', response);
      //    self.notifications.addNotification({
      //      message: 'Oops, something bad happened: ' + JSON.parse(response.jqXHR.responseText).errors[0],
      //      type: 'error'
      //    });
      //  }
      //);
    }
  }
});
