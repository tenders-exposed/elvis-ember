import Ember from 'ember';
import { raw } from 'ic-ajax';
import ENV from '../../config/environment';

export default Ember.Route.extend({
  queryParams: {
    confirmationToken: {
    }
  },
  model(params) {
    let token = params.confirmationToken;
    let self = this;
    let confirmationUrl = ENV.APP.apiHost + '/users/confirmation?confirmationToken=' + token;
    let req = raw({
      type: 'GET',
      url: confirmationUrl
    });
    req.then(function(result) {
      console.log('Response from Rails', result.response);
      self.notifications.addNotification({
        message: 'Your account is now activated!',
        type: 'success',
        autoClear: true
      });
      self.controller.transitionToRoute('login');
    },
    function(response) {
      console.error('There was a problem', response.jqXHR.responseText, response);
      let notification = 'Oops, something bad happened: ' + JSON.parse(response.jqXHR.responseText).errors[0];
      self.notifications.addNotification({
        message: notification,
        type: 'error'
      });
    }
    );
  }
});
