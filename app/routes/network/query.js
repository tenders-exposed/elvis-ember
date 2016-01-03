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
    console.log(this.get('ajax').request('/elastic/documents/countries'));
    return;
  },
  setupController(controller) {
    controller.set('years', [2002,2008]);
    this.get('ajax')
      .request(`${this.host}/api/${this.namespace}/contracts/countries`)
        .then((data) => {
          console.log(data);
          data.search.results.map((element) => {
            element.description = `${element.name} / ${element.key}`;
          });
          // this.get('elvisDb').save('countries', data.search.results).then((data) => {
          //   this.set('saving', false);
          //   console.log('Saved to IndexedDB!');
          // }, (err) => {
          //   console.log('Error: ', err);
          // });
          controller.set('countries', data.search.results);
        });
    this.get('ajax')
      .request(`${this.host}/api/${this.namespace}/contracts/cpvs/autocomplete`)
        .then((data) => {
          controller.set('cpvs', data.search.results);
        });
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
