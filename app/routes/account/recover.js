import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),


  actions: {
    deviseSendRecover(email) {
      this.notifications.clearAll();

      this.controller.validate().then(()=>{
        let data = `{ "user": { "email": "${email}" } }`;
        let headers = {
          'Content-Type': 'application/json'
        };
        this.get('ajax').post('users/password', {
          data: data,
          headers: headers
        }).then((response) => {
          console.log(response);
          this.controller.set('emailSent', true);

        },(response) => {
          console.log(data);
          console.log(headers);
          console.log(response);
        });


      }, (response)=>{
        let error = response.email[0];
        this.notifications.error(`Error: ${error}`);

      });

      // TODO: Very much WIP, will need to wrap this up ASAP

      // var req = raw({
      //   type: 'POST',
      //   url: '/users/password',
      //   data: { "user": { "email": email } }
      //   //,
      //   //dataType: 'json'
      // });
      // var self=this;
      // req.then(function(result){
      //     console.log('Response from Rails', result.response);
      //     self.notifications.addNotification({
      //       message: 'Password reset instructions were sent to your email address.',
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
