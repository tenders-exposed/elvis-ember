import Route from '@ember/routing/route';

export default Route.extend({
  classNames: ['body-page'],
  titleToken: 'Gallery',

  networksList: [
    '5a20194e2dcb5619d800004e'
  ],

  model() {
    return this.get('store')
      .findByIds('network', this.get('networksList'))
      .then((networks) => {
        return networks.map((n) => {
          let { name } = n;

          if (typeof name === 'undefined' || `${name}` === 'null') {
            n.name = 'Unnamed network';
          }

          n.set('minYear', Math.min(...n.get('query').years));
          n.set('maxYear', Math.max(...n.get('query').years));
          return n;
        });
      });
  }
});
