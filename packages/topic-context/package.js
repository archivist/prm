import TopicsContext from './TopicsContext'

export default {
  name: 'archivist-reader-topics',
  configure: function(config) {
    config.addContext('topics', TopicsContext, false)
    config.addIcon('topics', {'fontawesome': 'fa-tags'})
    config.addLabel('topics', {
      en: 'Topics',
      ru: 'Темы'
    })
  }
}
