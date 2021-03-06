import EmberRouter from '@ember/routing/router';
import Trackable from 'ember-cli-analytics/mixins/trackable';
import config from './config/environment';

const ElvisRouter = EmberRouter.extend(Trackable, {
  location: config.locationType,
  rootURL: config.rootURL
});

ElvisRouter.map(function() {
  this.route('welcome', { path: '/' });

  this.route('account', {}, function() {
    this.route('login');
    this.route('logout');
    this.route('confirm');
    this.route('recover', function() {
      this.route('password', {});
    });
    this.route('show', { path: ':id' });
    this.route('new');
    this.route('oauth-callback');
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
  this.route('about');
  this.route('contact');
  this.route('examples');
  this.route('features');
  this.route('gallery');
  this.route('terms-conditions');
  this.route('404', { path: '/*path' });
});

export default ElvisRouter;
