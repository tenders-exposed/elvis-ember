import Ember from 'ember';
import { initialize } from 'elvis-ember/instance-initializers/client';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import Application from '@ember/application';
import { run } from '@ember/runloop';

module('Unit | Instance Initializer | client', {
  beforeEach() {
    run(() => {
      this.application = Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach() {
    run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(this.appInstance);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
