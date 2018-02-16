import { SplitPane } from 'substance'
import { AbstractEntityPage } from 'archivist-js'
import { findIndex } from 'lodash-es'

class CollectionsPage extends AbstractEntityPage {
  render($$) {
    const Modal = this.getComponent('modal')

    let items = this.state.items
    let el = $$('div').addClass('sc-entity-page sm-entity-' + this.entityType)
    let main = $$('div').addClass('se-entity-layout')

    let header = this.renderHeader($$)

    let toolbox = this.renderToolbox($$)
    main.append(toolbox)

    if (this.props.entityId || this.state.dialog) {
      let EntityEditor = this.getComponent('entity-editor')
      main.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EntityEditor, {entityId: this.props.entityId})
        ).ref('modal')
      )
    }

    if(this.state.entityId && this.state.mode) {
      let ResourceOperator = this.getComponent('resource-operator')
      let index = findIndex(items, (i) => { return i.entityId === this.state.entityId })
      main.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(ResourceOperator, {entityId: this.state.entityId, item: items[index], mode: this.state.mode})
        ).ref('modal')
      )
    }

    if (items) {
      if (items.length > 0) {
        main.append(this.renderFull($$))
      } else {
        main.append(this.renderEmpty($$))
      }
    }

    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '40px'}).append(
        header,
        main
      )
    )

    return el
  }

  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }
}

CollectionsPage.entityType = 'collection'
CollectionsPage.pageName = 'collections'

export default CollectionsPage
