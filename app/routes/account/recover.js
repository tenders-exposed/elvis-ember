import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

const { Logger } = Ember;

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Recover your password',
  ajax: service(),

  activate() {
    let applicationController = this.controllerFor('application');
    applicationController.set('loginVisible', false);
  },

  actions: {
    sendChange(password, password_confirmation, token) {
      let self = this;
      let endpoint = `${ENV.APP.apiHost}/account/password/reset`;
      let options = {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resetPasswordToken: token,
          password
        })
      };

      let data = `{
                    "resetPasswordToken": "${token}",
                    "password": "${password}",
                  }`;

      return new RSVP.Promise((resolve, reject) => {
        fetch(endpoint, options).then((response) => {
          if (response.status >= 400) {
            throw(response);
          }
          self.notifications.info(`Your password was updated!`, {
            autoClear: true
          });
          self.transitionTo('welcome');
        }).catch((response) => {
          console.log('errors');
          response.json().then((json) => {
            _.each(json.errors, function(error) {
              self.notifications.error(`${error.message}`, {
                autoClear: false
              });
            });
          });
        });
      });
    },

    sendRecover(email) {
      let self = this;
      let endpoint = `${ENV.APP.apiHost}/account/password/forgot`;
      let url = `${endpoint}?email=${email}`;
      let options = {
        method: 'get',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      self.notifications.clearAll();
      this.controller.validate().then(() => {
        return new RSVP.Promise((resolve, reject) => {
          fetch(url, options).then((response) => {
            if (response.status >= 400) {
              throw(response);
            }
            // Logger.info(response);
            this.controller.set('emailSent', true);
          }).catch((response) => {
            console.log('errors');
            response.json().then((json) => {
              _.each(json.errors, function(error) {
                self.notifications.error(`${error.message}`, {
                  autoClear: false
                });
              });
            });
          });
        });
      });
    }
  }
});
