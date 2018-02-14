import { AbstractEntityPage } from 'archivist-js'

class GeofeaturesPage extends AbstractEntityPage {
  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }
}

GeofeaturesPage.entityType = 'geofeature'
GeofeaturesPage.pageName = 'geofeatures'

export default GeofeaturesPage
