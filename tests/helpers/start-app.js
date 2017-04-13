import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

const { merge, run } = Ember;
const { create } = Application;

export default function startApp(attrs) {
  let application;

  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
