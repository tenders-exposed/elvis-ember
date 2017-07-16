export function initialize(application) {
  application.inject('controller', 'me', 'service:me');
  application.inject('route', 'me', 'service:me');
}

export default {
  name: 'me',
  initialize
};
