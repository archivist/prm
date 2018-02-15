const ChangeStorePackage = require('archivist-js').ChangeStorePackage
const DocumentStorePackage = require('archivist-js').DocumentStorePackage
const EntityStorePackage = require('archivist-js').EntityStorePackage
const FragmentStorePackage = require('archivist-js').FragmentStorePackage
const SessionStorePackage = require('archivist-js').SessionStorePackage
const SnapshotStorePackage = require('archivist-js').SnapshotStorePackage
const UserStorePackage = require('archivist-js').UserStorePackage
const FileStorePackage = require('./file/package')

module.exports = {
  name: 'sgn-store',
  configure: function(config) {
    config.import(ChangeStorePackage)
    config.import(DocumentStorePackage)
    config.import(EntityStorePackage)
    config.import(FragmentStorePackage)
    config.import(SessionStorePackage)
    config.import(SnapshotStorePackage)
    config.import(UserStorePackage)
    config.import(FileStorePackage)
  }
}