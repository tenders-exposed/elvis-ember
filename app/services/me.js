import Ember from 'ember';

const { Service, inject, computed } = Ember;

export default Service.extend({
  session: inject.service(),

  init() {
    this.set('data', computed('session.session.content.authenticated', function() {
      // console.log('session', this.get('session.session.content.authenticated'));
      return this.get('session.session.content.authenticated');
    }));
  }
});
