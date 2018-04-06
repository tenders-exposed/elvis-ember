import Route from '@ember/routing/route';

export default Route.extend({

  activate() {
    if (this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
      this.get('router').transitionTo('welcome');
    }
  }
});
