import CommentariesPage from './CommentariesPage'

export default {
  name: 'commentary-manager',
  configure: function(config) {
    config.addPage(CommentariesPage.pageName, CommentariesPage)
    config.addLabel('commentary', {
      en: 'Historical Commentary',
      ru: 'Исторические комментарии'
    })
    config.addLabel('commentaries', {
      en: 'Historical Commentaries',
      ru: 'Исторический комментарии'
    })
    config.addLabel('add-commentary', {
      en: '+ Add Commentary',
      ru: '+ Добавить комментарий'
    })
  }
}
