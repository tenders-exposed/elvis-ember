import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const ElvisRouter = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

ElvisRouter.map(function() {
  this.route('welcome', { path: '/' });

  this.route('account', {}, function() {
    this.route('login');
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
        this.route('show', { path: ':id' });
        this.route('contract', { path: '/:node_id/:contract_id' });
      });
    });
  });
  this.route('about');
  this.route('contact');
  this.route('examples');
  this.route('features');
  this.route('gallery');
  this.route('terms-conditions');
  this.route('404', { path: '/*path' });
});

export default ElvisRouter;
