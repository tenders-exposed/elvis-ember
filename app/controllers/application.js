import Ember from 'ember';

const { Controller, inject } = Ember;

export default Controller.extend({
  analytics: inject.service(),
  loginVisible: false
});
