import ResourcesContext from './ResourcesContext'

export default {
  name: 'archivist-reader-resources',
  configure: function(config) {
    config.addContext('resources', ResourcesContext, false)
    config.addIcon('resources', {'fontawesome': 'fa-comments'})
    config.addIcon('map-link', {'fontawesome': 'fa-crosshairs'})
    config.addIcon('resource-link', {'fontawesome': 'fa-book'})
    config.addLabel('resources', {
      en: 'Commentary',
      ru: 'Комментарий'
    })
    config.addLabel('topic-resources', {
      en: 'Contents',
      ru: 'Содержание'
    })
    config.addLabel('geofeature-resources', {
      en: 'Geofeatures',
      ru: 'Упоминаемые места'
    })
    config.addLabel('commentary-resources', {
      en: 'Commentary',
      ru: 'Упоминаемые лица и события'
    })
    config.addLabel('resource-link', {
      en: 'Find in other documents',
      ru: 'Найти в других документах'
    })
    config.addLabel('map-link', {
      en: 'Show on map',
      ru: 'Показать на карте'
    })
    config.addLabel('person-link', {
      en: 'Find in persons index',
      ru: 'Найти в индексе персоналий'
    })
    config.addLabel('unknown-name', {
      en: 'Unknown name',
      ru: 'Название неизвестно'
    })
  }
}
