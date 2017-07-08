export function initialize(application) {
  // appInstance.inject('route', 'foo', 'service:foo');
  application.inject('controller', 'me', 'service:me');
  application.inject('route', 'me', 'service:me');
}

export default {
  name: 'me',
  initialize
};
