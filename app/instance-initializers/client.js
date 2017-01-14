export function initialize(application) {
  application.inject('route', 'client', 'service:client');
  application.inject('controller', 'client', 'service:client');
}

export default {
  name: 'client',
  initialize
};
