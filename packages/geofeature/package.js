import GeofeatureReference from './GeofeatureReference'
import GeofeatureComponent from './GeofeatureComponent'
import GeofeatureCommand from './GeofeatureCommand'
import GeofeatureContextItem from './GeofeatureContextItem'

export default {
  name: 'geofeature',
  configure: function(config) {
    config.addNode(GeofeatureReference)
    config.addCommand(GeofeatureReference.type, GeofeatureCommand, { nodeType: GeofeatureReference.type })
    config.addIcon(GeofeatureReference.type, {'fontawesome': 'fa-globe'})
    config.addComponent('geofeature', GeofeatureComponent)
    config.addContextItem('geofeature', GeofeatureContextItem)
    config.addLabel('geofeature-resources', {
      en: 'Geo Feature',
      ru: 'Географический объект'
    })
    config.addLabel('geofeature', {
      en: 'Geofeature',
      ru: 'Топоним'
    })
  }
}
