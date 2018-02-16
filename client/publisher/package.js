import { ProseEditorPackage } from 'substance'
import { ArchivistPackage, ArchivistSubConfigurator, CommentsPackage, IndentationPackage, MetadataEditorPackage, ResourcesPackage, TimecodeAnnotatorPackage, WhitespacePackage } from 'archivist-js'
import InterviewPackage from '../../packages/interview/package'
import PageFilterPackage from '../../packages/page-filter/package'
import FormsPackage from '../../packages/forms/package'
import MenuPackage from '../../packages/menu/package'
import DocumentManagerPackage from '../../packages/documents/package'
import CollectionManagerPackage from '../../packages/collection/package'
import CommentaryManagerPackage from '../../packages/commentary-manager/package'
import GeofeatureManagerPackage from '../../packages/geofeature-manager/package'
import PublisherPackage from '../../packages/publisher/package'
import TopicManagerPackage from '../../packages/topic-manager/package'
import TopicContextPackage from '../../packages/topic-editor-context/package'
import FileContextPackage from '../../packages/file-context/package'
import UsersPackage from '../../packages/users/package'
import AuthenticationClient from './AuthenticationClient'
import DocumentClient from './DocumentClient'
import FileClient from './FileClient'
import ResourceClient from './ResourceClient'

// Entities definitions
import Collection from '../../packages/collection/Collection'
import Commentary from '../../packages/commentary/Commentary'
import Geofeature from '../../packages/geofeature/Geofeature'
import Topic from '../../packages/topic/Topic'

const { ProseArticle } = ProseEditorPackage

let appConfig = 'ARCHIVISTCONFIG'
appConfig = JSON.parse(appConfig)

export default {
  name: 'archivist-publisher',
  configure: function(config) {
    // Use the default Archivist package
    config.setDefaultLanguage(appConfig.defaultLanguage)
    config.import(ArchivistPackage)
    config.import(PageFilterPackage)
    // Override Archivist form package
    config.import(FormsPackage)
    config.import(MenuPackage)
    // Manage documents
    config.import(DocumentManagerPackage)
    // Manage collection entity type
    config.import(CollectionManagerPackage)
    // Manage commentary entity type
    config.import(CommentaryManagerPackage)
    // Manage toponym entity type
    config.import(GeofeatureManagerPackage)
    // Manage topics
    config.import(TopicManagerPackage)
    // Manage users
    config.import(UsersPackage)

    // Add subconfigurators
    let EditorConfigurator = new ArchivistSubConfigurator()
    EditorConfigurator.import(PublisherPackage)
    EditorConfigurator.import(MetadataEditorPackage)
    EditorConfigurator.import(TopicContextPackage)
    EditorConfigurator.import(CommentsPackage)
    EditorConfigurator.import(ResourcesPackage)
    EditorConfigurator.import(FileContextPackage)
    EditorConfigurator.import(InterviewPackage)
    EditorConfigurator.import(IndentationPackage)
    EditorConfigurator.import(WhitespacePackage)
    EditorConfigurator.import(TimecodeAnnotatorPackage)
    EditorConfigurator.setContextMapping({
      'topic': 'topics',
      'commentary': 'resources',
      'geofeature': 'resources',
      'comment': 'comments'
    })
    EditorConfigurator.setDefaultLanguage(appConfig.defaultLanguage)
    config.addConfigurator('archivist-interview-editor', EditorConfigurator, true)

    // Entities subconfigurator
    let EntitiesConfigurator = new ArchivistSubConfigurator()
    EntitiesConfigurator.defineSchema({
      name: 'archivist-entities',
      version: '1.0.0',
      DocumentClass: ProseArticle
    })
    EntitiesConfigurator.addNode(Collection)
    EntitiesConfigurator.addNode(Commentary)
    EntitiesConfigurator.addNode(Geofeature)
    EntitiesConfigurator.addNode(Topic)
    EntitiesConfigurator.setDefaultLanguage(appConfig.defaultLanguage)
    config.addConfigurator('archivist-entities', EntitiesConfigurator)

    config.setAppConfig({
      protocol: appConfig.protocol,
      host: appConfig.host,
      port: appConfig.port,
      wsUrl: appConfig.wsUrl,
      mediaPath: appConfig.mediaPath
    })

    // Define Authentication Client
    config.setAuthenticationServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/auth/')
    config.setAuthenticationClient(AuthenticationClient)
    // Define Document Client
    config.setDocumentServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/documents/')
    config.setDocumentClient(DocumentClient)
    // Define File Client
    config.setFileServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/media/')
    config.setFileClient(FileClient)
    // Define Resource Client
    config.setResourceServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/entities/')
    config.setResourceClient(ResourceClient)

    config.setMenuItems([
      {icon: 'fa-file-text', label: 'documents', action: 'archive'},
      {icon: 'fa-tags', label: 'Topics', action: 'topics'},
      {icon: 'fa-globe', label: 'geofeatures', action: 'geofeatures'},
      {icon: 'fa-comments', label: 'commentary', action: 'commentaries'},
      {icon: 'fa-inbox', label: 'collections', action: 'collections'},
      {icon: 'fa-id-badge', label: 'users', action: 'users'}
    ])

    config.setDefaultResourceTypes(['commentary'])
  }
}
