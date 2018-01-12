import Service from '@ember/service';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),

  init() {
    this.set('data', computed('session.session.content.authenticated', function() {
      // console.log('session', this.get('session.session.content.authenticated'));
      return this.get('session.session.content.authenticated');
    }));
  }
});
