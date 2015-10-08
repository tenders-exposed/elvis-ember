import Ember from 'ember';
import { raw } from 'ic-ajax';
import ENV from "../../config/environment";

export default Ember.Route.extend({
  queryParams: {
    confirmation_token: {
    }
  },
  model: function(params) {
    var token = params.confirmation_token;
    var self = this;
    var req = raw({
      type: 'GET',
      url: ENV.APP.apiHost + '/users/confirmation?confirmation_token=' + token
    });
    req.then(function(result){
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
      self.notifications.addNotification({
        message: 'Oops, something bad happened: ' + JSON.parse(response.jqXHR.responseText).errors[0],
        type: 'error',
      });
    }
    );
  }
});
