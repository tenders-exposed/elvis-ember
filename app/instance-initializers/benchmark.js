export function initialize(application) {
  application.inject('route', 'benchmark', 'service:benchmark');
  application.inject('controller', 'benchmark', 'service:benchmark');
}

export default {
  name: 'benchmark',
  initialize
};
