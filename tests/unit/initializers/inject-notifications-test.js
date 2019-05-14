import InjectNotificationsInitializer from 'elvis-ember/initializers/inject-notifications';
import { module, test } from 'qunit';
import Application from '@ember/application';
import { run } from '@ember/runloop';

let application;

module('Unit | Initializer | inject notifications', {
  beforeEach() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  InjectNotificationsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
