import Ember from 'ember';
import ENV from '../config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import BodyClassMixin from 'ember-body-class/mixins/body-class';

const { Route, inject } = Ember;
const { APP } = ENV;

export default Route.extend(ApplicationRouteMixin, BodyClassMixin, {

  classNames: ['body-page'],

  host: APP.apiHost,
  namespace: APP.apiNamespace,
  dbVersion: APP.dbVersion,
  ajax: inject.service(),
  session: inject.service(),
  me: inject.service(),
  title: (tokens) => {
    return tokens.length ?
      `${tokens.join(' - ')} - Elvis` :
      'Elvis';
  },

  model() {
    if (this.get('session.isAuthenticated')) {
      // return undefined; // this.store.findRecord('user', this.get('me.data.id'));
      return this.store.findRecord('user', this.get('me.data.access_token'));
    } else {
      return undefined;
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bodyType', 'body-page');
  },

  init() {
    this.setupLoader();
  },

  setupLoader() {
    this.controllerFor('loading').get('loaderWords').pushObject('network');
  },

  actions: {
    // resetting the toggled menu for all routes
    didTransition() {
      this.controllerFor('application').set('dropMenu', false);
      this.controllerFor('application').set('footer', 'partials/footer');
    }
  }
});
