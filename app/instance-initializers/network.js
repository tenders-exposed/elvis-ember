export function initialize(application) {
  application.inject('route', 'networkService', 'service:network');
  application.inject('controller', 'networkService', 'service:network');
}

export default {
  name: 'network',
  initialize
};
