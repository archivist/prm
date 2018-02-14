import TopicsPage from './TopicsPage'

export default {
  name: 'topic-manager',
  configure: function(config) {
    config.addPage(TopicsPage.pageName, TopicsPage)
    config.addLabel('topics', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('add-topic', {
      en: '+ Add Topic',
      ru: '+ Добавить тему'
    })
  }
}
