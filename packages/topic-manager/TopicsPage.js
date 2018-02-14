import { AbstractEntityPage } from 'archivist-js'

class TopicsPage extends AbstractEntityPage {
  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }
}

TopicsPage.entityType = 'topic'
TopicsPage.pageName = 'topics'

export default TopicsPage
