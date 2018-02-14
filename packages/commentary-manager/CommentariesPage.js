import { AbstractEntityPage } from 'archivist-js'

class CommentariesPage extends AbstractEntityPage {
  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }
}

CommentariesPage.entityType = 'commentary'
CommentariesPage.pageName = 'commentaries'

export default CommentariesPage
