import Ember from 'ember';
import config from './config/environment';

const { Router } = Ember;

const ElvisRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

ElvisRouter.map(function() {
  this.route('account', {}, function() {
    this.route('confirm');
    this.route('recover', function() {
      this.route('password', {});
    });
    this.route('settings', function() {
      this.route('password', {});
    });
    this.route('disable', function() {
      this.route('delete', {});
    });
    this.route('show', { path: ':id' });
    this.route('new');
  });

  this.route('network', function() {
    this.route('list');
    this.route('new');
    this.route('show', { path: ':network_id' }, function() {
      this.route('details', { path: ':tab' }, function() {
        this.route('contract', { path: '/:node_id/:contract_id' });
        this.route('show', { path: ':id' });
      });
    });
  });
  this.route('welcome', { path: '/' }, function() {
    this.route('login');
  });
  this.route('static', { path: ':target' });
});

export default ElvisRouter;
