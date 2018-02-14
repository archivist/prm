let Indexer = require('./Indexer')

module.exports = {
  name: 'ost-indexer',
  configure: function(config) {
    let db = config.getDBConnection()
    let indexer = new Indexer({
      db: db,
      configurator: config,
      documentEngine: config.getEngine('document'),
      fragmentStore: config.getStore('fragment'),
      resourceEngine: config.getEngine('resource'),
      snapshotEngine: config.getEngine('snapshot')
    })

    config.addEngine('indexer', indexer)
  }
}