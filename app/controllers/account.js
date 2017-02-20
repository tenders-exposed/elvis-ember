import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Controller } = Ember;

export default Controller.extend(AuthenticatedRouteMixin, {
});
