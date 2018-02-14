import CollectionsPage from './CollectionsPage'

export default {
  name: 'respondent-manager',
  configure: function(config) {
    config.addPage(CollectionsPage.pageName, CollectionsPage)
    config.addLabel('collections', {
      en: 'Collections',
      ru: 'Коллекции'
    })
    config.addLabel('add-collection', {
      en: '+ Add Collection',
      ru: '+ Добавить коллекцию'
    })
    config.addLabel('collection-default-name', {
      en: 'Unknown Collection',
      ru: 'Безымянная коллекция'
    })
    config.addLabel('collection-name-placeholder', {
      en: 'Enter collection name',
      ru: 'Название коллекции'
    })
    config.addLabel('collection-description-placeholder', {
      en: 'Enter collection description',
      ru: 'Описание коллекции'
    })
  }
}
