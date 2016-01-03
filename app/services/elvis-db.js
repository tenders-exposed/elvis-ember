import IndexedDBStore from 'ember-cli-indexeddb-wrapper/services/indexeddb-store';

/*
    Any time you update your objectStores property, increment version to
    trigger creation of the new stores

*/

export default IndexedDBStore.extend({
  // Override these properties to customise for your application
  // objectStores: [{ name: 'things', indexes: [{key: 'name', options: {unique: true}}]}]
  databaseNamespace: 'elvisDb',
  version: 1,
  objectStores: [
    {
      name: 'countries',
      indexes: [
        {
          key: 'key',
          options: {
            unique: true
          }
        }
      ]
    },
    {
      name: 'cpvs',
      indexes: [
        {
          key: 'code',
          options: {
            unique: true
          }
        }
      ]
    },
    {
      name: 'networks'
    }
  ]
});
