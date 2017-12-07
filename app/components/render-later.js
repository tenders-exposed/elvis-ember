import Ember from 'ember';

const {
  Component,
  run,
  RSVP,
  Logger
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
    let self = this;
    let loadData = function(data) {
      let promise = new RSVP.Promise(function(resolve, reject) {
        if (data) {
          // Logger.debug('render later got data', data);
          Logger.debug('render later got data', self.get('wait'));
          resolve(data);
        } else {
          Logger.debug('render later nope', self.get('wait'));

          reject('mesaj eroare');
        }
      });/*.catch(function(error) {
        // @todo:catch the error
        console.error('error', error);
      });*/
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
      } else {
        Logger.debug('renderlater this', this);
      }

    }, this.get('wait'));
  },

  willDestroy() {
    this._super();
    run.cancel(this._renderTimer);
  }
});
