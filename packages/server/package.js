let config = require('config')
let extend = require('lodash/extend')
let ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')})
let Database = require('./Database')
let EnginePackage = require('../engine/package')
let IndexerPackage = require('../indexer/package')
let ResourceServerPackage = require('./resource/package')
let ConverterServerPackage = require('./converter/package')
let DocumentServerPackage = require('./document/package')
let ArchivistSubConfigurator = require('archivist-js').ArchivistSubConfigurator
let AuthServerPackage = require('archivist-js').AuthServerPackage
let CollabServerPackage = require('archivist-js').CollabServerPackage
let FileServerPackage = require('./file/package')
let UserServerPackage = require('archivist-js').UserServerPackage
let InspectorPackage = require('archivist-js').InspectorPackage

let db = new Database()

let InterviewPackage = require('../../dist/prm.cjs').InterviewPackage
//let SubjectsPackage = require('../../dist/prm.cjs').SubjectsPackage

module.exports = {
  name: 'prm-server',
  configure: function(config) {
    config.setAppConfig(ServerConfig)
    config.setDBConnection(db)
    config.import(InterviewPackage)
    config.import(EnginePackage)
    config.import(IndexerPackage)
    config.import(InspectorPackage)
    config.import(DocumentServerPackage)
    config.import(AuthServerPackage)
    config.import(CollabServerPackage)
    config.import(FileServerPackage)
    config.import(ResourceServerPackage)
    config.import(UserServerPackage)
    config.import(ConverterServerPackage)

    // Subjects subconfigurator
    //config.addConfigurator('archivist-subjects', new ArchivistSubConfigurator().import(SubjectsPackage))
  }
}
