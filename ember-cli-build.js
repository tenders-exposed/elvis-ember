/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ['bower_components/materialize/sass']
    },
    nodeAssets: {
      'vis': {
        srcDir: 'dist',
        vendor: {
          include: ['img/network/cross.png']
        },
        public: {
          include: ['img/network/cross.png']
        }
      }
    }
  });


  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
  // app.import('bower_components/vis/dist/vis.js');
  // app.import('bower_components/datatables/media/js/jquery.dataTables.min.js');
  // app.import('bower_components/datatables/media/js/dataTables.material.min.js');

  // app.import('bower_components/datatables/media/css/dataTables.material.min.css');
  // app.import('bower_components/ag-grid/dist/styles/theme-material.css');

  app.import('bower_components/lodash/lodash.js');

  app.import('bower_components/clientjs/src/vendor/deployJava.js', {type: 'vendor', prepend: true});
  app.import('bower_components/clientjs/src/vendor/fontdetect.js', {type: 'vendor', prepend: true});
  app.import('bower_components/clientjs/src/vendor/murmurhash3.js', {type: 'vendor', prepend: true});
  app.import('bower_components/clientjs/src/vendor/swfobject.js', {type: 'vendor', prepend: true});
  app.import('bower_components/clientjs/src/vendor/ua-parser.js', {type: 'vendor', prepend: true});
  app.import('bower_components/clientjs/src/client.js');

  return app.toTree();
};
