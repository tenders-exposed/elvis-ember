import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  analytics: service(),
  auth: service(),

  loginVisible: computed('auth.loginVisible', function() {
    return this.get('auth.loginVisible');
  })
});
