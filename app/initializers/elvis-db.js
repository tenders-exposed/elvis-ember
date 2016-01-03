export function initialize(container, application/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  application.inject('controller', 'elvisDb', 'service:elvisDb');
  application.inject('route', 'elvisDb', 'service:elvisDb');
}

export default {
  name: 'elvisDb',
  initialize
};
