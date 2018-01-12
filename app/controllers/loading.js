import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
  loaderText: '',
  loaderWords: A(),

  init() {
    this._super(...arguments);
    this.get('loaderWords').pushObject('loading');
  }
});
