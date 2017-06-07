import Ember from 'ember';

const {
  Component,
  run,
  RSVP
} = Ember;

export default Component.extend({
  tagName: '',
  wait: 0,
  shouldRender: false,
  _renderTimer: null,
  load: null,
  model: null,
  loading: false,

  didInsertElement() {
    let loadData = function(data) {
      let promise = new RSVP.Promise(function(resolve, reject) {
        if (data) {
          resolve(data);
        } else {
          reject('mesaj eroare');
        }
      });
      return promise;
    };
    this._renderTimer = run.later(this, function() {
      if (!this.get('loading')) {
        loadData(this.get('load')).then((data) => {
          if (!this.get('isDestroyed')) {
            this.set('shouldRender', true);
            this.set('model', data);
          }
        });
      }
      /*.catch(function(error) {
         // @todo:catch the error
        console.error('error', error);
      });*/

    }, this.get('wait'));
  },

  willDestroy() {
    this._super();
    run.cancel(this._renderTimer);
  }
});
