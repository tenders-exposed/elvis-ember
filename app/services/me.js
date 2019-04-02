import Service from '@ember/service';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Service.extend({
  session: service(),
  ajax: service(),
  endpoint: `${ENV.APP.apiHost}/account/login`,

  details: computed('data', function() {
    let options = {
      headers: {
        'Authorization': this.get('data').access_token
      },
      method: 'GET'
    };

    let self = this;
    return new RSVP.Promise((resolve, reject) => {
      fetch(this.get('endpoint'), options).then((response) => {
        return self.set('user', response);
      }).catch(reject);
    });
  }),

  init() {
    this._super(...arguments);
    let routeName = window.location.href.split('/').pop();
    if (routeName == 'logout') {
      if (this.get('session.isAuthenticated')) {
        return this.get('session').invalidate();
      }
    }

    this.set('data', computed('session.session.content.authenticated', function() {
      // console.log('session', this.get('session.session.content.authenticated'));
      let data = this.get('session.session.content.authenticated');
      return data;
    }));
  }
});
