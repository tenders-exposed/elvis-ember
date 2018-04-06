import Route from '@ember/routing/route';
import ENV from '../config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import BodyClassMixin from 'ember-body-class/mixins/body-class';
import { inject as service } from '@ember/service';

const { APP } = ENV;

export default Route.extend(ApplicationRouteMixin, BodyClassMixin, {

  classNames: ['body-page'],

  host: APP.apiHost,
  namespace: APP.apiNamespace,
  dbVersion: APP.dbVersion,
  ajax: service(),
  session: service(),
  me: service(),
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
    this._super(...arguments);
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
