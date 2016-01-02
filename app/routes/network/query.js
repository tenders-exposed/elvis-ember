import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Route.extend({
  host: ENV.APP.apiHost,
  namespace: ENV.APP.apiNamespace,
  //  renderTemplate: function(){
  //    this.render('graph/new');
  //  }
  ajax: Ember.inject.service(),
  countries() {
    // console.log(this.get('ajax').request('/elastic/documents/countries'));
    return;
  },
  setupController(controller) {
    controller.set('years', [2002,2008]);
    controller.set('countries', ['UK']);
    // this.get('ajax')
    //   .request(this.host + '/api/' + this.namespace + '/elastic/contracts/countries')
    //     .then((data) => {
    //       data.search.results.map((element) => {
    //         element.description = element.name + ' / ' + element.key;
    //         //console.log(element);
    //       });
    //       controller.set('countries', data.search.results);
    //     });
  },
  actions: {
    slidingAction(value) {
      // Ember.debug( "New slider value: %@".fmt( value ) );
      this.controller.set('years', value[0]);
      Ember.run.scheduleOnce('afterRender', function() {
        Ember.$('span.left-year').text(value[0]);
        Ember.$('span.right-year').text(value[1]);
      });
    },
    sendForm() {
      // console.log("Years: ", this.controller.years);
      this.transitionTo('network.show', 1);
    }
  }
});
