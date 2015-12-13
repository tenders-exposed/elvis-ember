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
  this.route('projects', {}, function() {
  });
  this.route('account', {}, function() {
    this.route('new', {path: 'register'});
    this.route('confirm', {});
    this.route('reset', {});
    this.route('recover', {path: 'recover'});
    this.route('settings', {});
    this.route('destroy', {});
    this.route('show', {path: ":id"});
  });
});

export default Router;
