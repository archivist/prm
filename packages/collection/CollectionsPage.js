import { AbstractEntityPage } from 'archivist-js'

class CollectionsPage extends AbstractEntityPage {
  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }
}

CollectionsPage.entityType = 'collection'
CollectionsPage.pageName = 'collections'

export default CollectionsPage
