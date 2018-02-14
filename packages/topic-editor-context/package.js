import TopicsContext from './TopicsContext'

export default {
  name: 'archivist-publisher-topics',
  configure: function(config) {
    config.addContext('topics', TopicsContext, true)
    config.addIcon('topics', {'fontawesome': 'fa-tags'})
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addLabel('topics', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('goBackToTopics', {
      en: 'Topics',
      ru: 'К списку тем'
    })
  }
}
