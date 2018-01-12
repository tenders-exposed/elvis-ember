import Ember from 'ember';
import Service from '@ember/service';
import { computed } from '@ember/object';

const { inject } = Ember;

export default Service.extend({
  session: inject.service(),

  init() {
    this.set('data', computed('session.session.content.authenticated', function() {
      // console.log('session', this.get('session.session.content.authenticated'));
      return this.get('session.session.content.authenticated');
    }));
  }
});
