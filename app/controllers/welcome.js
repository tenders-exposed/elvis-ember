import Ember from 'ember';
import { inject as service } from '@ember/service';

const { Controller } = Ember;

export default Controller.extend({
  me: service()
});
