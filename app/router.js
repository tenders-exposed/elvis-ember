import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
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
  });
  this.route('projects');
  this.route('network', function() {
    this.route('query', function() {
      this.route('config', {});
    });
    this.route('show', { path: ':network_id' }, function() {
      this.route('details', function() {
        this.route('suppliers', function() {
          this.route('show', { path: ':supplier_id' }, function() {
            this.route('contracts', function() {
              this.route('show', { path: ':contract_id' });
            });
            this.route('procurers', {});
            this.route('stats', {});
          });
        });
        this.route('procurers', function() {
          this.route('show', { path: ':procurer_id' }, function() {
            this.route('contracts', function() {
              this.route('show', { path: ':id' });
            });
            this.route('procurers', {});
            this.route('stats', {});
          });
        });
        this.route('relationships', {});
      });
    });
  });
  this.route('welcome', { path: '' });
});

export default Router;
