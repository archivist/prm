import { ProseEditorPackage } from 'substance'
import ScholarPackage from '../../packages/scholar/package'
import ExplorerPackage from '../../packages/explorer/package'
import ReaderPackage from '../../packages/reader/package'
import InterviewPackage from '../../packages/interview/package'
import SourceContextPackage from '../../packages/source-context/package'
import ResourcesContextPackage from '../../packages/resources-context/package'
import ScholarSubConfigurator from '../../packages/scholar/ScholarSubConfigurator'
import DocumentClient from './DocumentClient'
import ResourceClient from './ResourceClient'

// Entities definitions
import Commentary from '../../packages/commentary/Commentary'
import Geofeature from '../../packages/geofeature/Geofeature'
import Topic from '../../packages/topic/Topic'

const { ProseArticle } = ProseEditorPackage

let appConfig = 'ARCHIVISTCONFIG'
appConfig = JSON.parse(appConfig)

export default {
  name: 'archivist-scholar',
  configure: function(config) {
    config.import(ScholarPackage)
    config.import(ExplorerPackage)
    config.setDefaultLanguage(appConfig.defaultLanguage)

    // Add subconfigurators
    // Reader subconfigurator
    let ReaderConfigurator = new ScholarSubConfigurator()
    ReaderConfigurator.import(ReaderPackage)
    ReaderConfigurator.import(InterviewPackage)
    ReaderConfigurator.import(SourceContextPackage)
    ReaderConfigurator.import(ResourcesContextPackage)
    ReaderConfigurator.setResourceTypes([
      {id: 'geofeature', name: 'geofeature-resources'},
      {id: 'commentary', name: 'commentary-resources'}
    ])
    ReaderConfigurator.setDefaultLanguage(appConfig.defaultLanguage)
    config.addConfigurator('archivist-interview-reader', ReaderConfigurator)

    // Entities subconfigurator
    let EntitiesConfigurator = new ScholarSubConfigurator()
    EntitiesConfigurator.defineSchema({
      name: 'archivist-entities',
      DocumentClass: ProseArticle
    })
    EntitiesConfigurator.addNode(Commentary)
    EntitiesConfigurator.addNode(Geofeature)
    EntitiesConfigurator.addNode(Topic)
    config.addConfigurator('archivist-entities', EntitiesConfigurator)

    config.setAppConfig({
      protocol: appConfig.protocol,
      host: appConfig.host,
      port: appConfig.port,
      defaultLanguage: appConfig.defaultLanguage,
      mediaServer: appConfig.mediaServer,
      mediaPath: appConfig.mediaPath
    })

    // Define Document Client
    config.setDocumentServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/documents/')
    config.setDocumentClient(DocumentClient)
    // Define Resource Client
    config.setResourceServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/entities/')
    config.setResourceClient(ResourceClient)
  }
}
