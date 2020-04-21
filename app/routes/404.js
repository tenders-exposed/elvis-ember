import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Page Not Found',
  actions: {
    error: function (error) {
      console.log('error', error);
    },
    closeError() {
      console.log('trying to close the error');
      /*this.transitionTo(
       'network.show.details',
       this.controllerFor('network.show.details').get('activeTab')
       );*/
    },
    closeDetails() {
      console.log('trying to close the error');

    }
  }


});
