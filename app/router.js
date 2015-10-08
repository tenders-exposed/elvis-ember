import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('graph', {path: "graphs"}, function() {
    this.route('show', {path: ":id"});
    this.route('new', {});
  });
  this.route('account', {}, function() {
    this.route('settings', {});
    this.route('reset', {});
  });
});

export default Router;
