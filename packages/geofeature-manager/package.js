import GeofeaturesPage from './GeofeaturesPage'

export default {
  name: 'geofeature-manager',
  configure: function(config) {
    config.addPage(GeofeaturesPage.pageName, GeofeaturesPage)
    config.addLabel('geofeatures', {
      en: 'Geofeatures',
      ru: 'Географические объекты'
    })
    config.addLabel('add-geofeature', {
      en: '+ Add Geofeature',
      ru: '+ Добавить геообъект'
    })
  }
}
