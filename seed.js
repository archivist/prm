var Database = require('./packages/server/Database');
var Configurator = require('archivist-js').ServerConfigurator;
var StorePackage = require('archivist-js').ArchivistStorePackage;

var db = new Database();
var configurator = new Configurator().import(StorePackage);

if(process.argv[2] === 'dev') {
  var devSeed = require('./data/devSeed');
  // eslint-disable-next-line
  console.log('Development seeding...');

  db.reset() // Clear the database, set up the schema
    .then(function() {
      // We should drop connection and establish it again,
      // so massive will have new tables attached
      db.shutdown();
      db = new Database();
      configurator.setDBConnection(db);
      var userStore = configurator.getStore('user');
      return userStore.seed(devSeed.users);
    }).then(function() {
      var sessionStore = configurator.getStore('session');
      return sessionStore.seed(devSeed.sessions);
    }).then(function() {
      var entityStore = configurator.getStore('entity');
      return entityStore.seed(devSeed.entities);
    }).then(function() {
      var documentStore = configurator.getStore('document');
      return documentStore.seed(devSeed.documents);
    }).then(function() {
      var changeStore = configurator.getStore('change');
      return changeStore.seed(devSeed.changes);
    }).then(function() {
      // eslint-disable-next-line
      console.log('Done seeding.');
      db.shutdown();
    });
} else {
  var seed = require('./data/seed');
  // eslint-disable-next-line
  console.log('Database setup...');

  db.reset()
    .then(function() {
      // We should drop connection and establish it again,
      // so massive will have new tables attached
      db.shutdown();
      db = new Database();
      configurator.setDBConnection(db);
      var userStore = configurator.getStore('user');
      return userStore.seed(seed.users);
    }).then(function() {
      var sessionStore = configurator.getStore('session');
      return sessionStore.seed(seed.sessions);
    }).then(function() {
      // eslint-disable-next-line
      console.log('Done seeding.');
      db.shutdown();
    });
}
