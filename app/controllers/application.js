import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  analytics: service(),
  auth: service(),

  loginVisible: alias('auth.loginVisible')
});
