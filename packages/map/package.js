import MapBrowser from './MapBrowser'

export default {
  name: 'ost-map',
  configure: function(config) {
    config.addPage('maps', MapBrowser)
    config.addIcon('sidebar-click', {'fontawesome': 'fa-hand-o-up'})
    config.addIcon('sidebar-back', {'fontawesome': 'fa-hand-o-left'})
    config.addIcon('sidebar-stats', {'fontawesome': 'fa-book'})
    config.addIcon('toponym-symbol', {'fontawesome': 'fa-globe'})
    config.addIcon('prison-symbol', {'fontawesome': 'fa-table'})
    config.addIcon('filter-visible', {'fontawesome': 'fa-eye'})
    config.addIcon('filter-hidden', {'fontawesome': 'fa-eye-slash'})
    config.addLabel('map-documents', {
      en: 'Documents',
      ru: 'Документы'
    })
    config.addLabel('map-mentions', {
      en: 'Mentions',
      ru: 'Упоминания'
    })
    config.addLabel('sidebar-back', {
      en: 'Go back to locations list',
      ru: 'Вернуться к списку локаций'
    })
    config.addLabel('sidebar-click', {
      en: 'Click on location to get additional info',
      ru: 'Нажмите на локацию для получения информации'
    })
    config.addLabel('toponym-filter', {
      en: 'Mentioned toponyms',
      ru: 'Упомянутые топонимы'
    })
    config.addLabel('prison-filter', {
      en: 'Places of detention',
      ru: 'Места работы и заключения'
    })
  }
}