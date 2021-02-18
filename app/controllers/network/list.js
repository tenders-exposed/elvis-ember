import Ember from 'ember';
import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';

export default Controller.extend({
  sortProperties: ['created:desc'],
  sortedModel: Ember.computed.sort('model', 'sortProperties')
});