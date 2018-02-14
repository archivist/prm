import { Component } from 'substance'

class GeofeatureContextItem extends Component {

  render($$) {
    let isEditor = this.context.readerContext === undefined
    if(isEditor) {
      return this.renderEditorItem($$)
    } else {
      return this.renderReaderItem($$)
    }
  }

  renderEditorItem($$) {
    let node = this.props.data

    let el = $$('div')
      .attr("data-id", this.props.entityId)
      .addClass('sc-entity-entry se-geofeature')

    if(this.props.focus) {
      el.addClass('se-focused')
    }

    el.append(
      $$('div').addClass('se-type').append(this.getLabel('geofeature')),
      $$('div').addClass('se-title').append(node.name),
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    if(this.props.mode !== 'view') {
      el.append(
        $$('div').addClass('se-edit-entity').append(this.context.iconProvider.renderIcon($$, 'editEntity'))
          .on('click', this.editEntity)
      ).on('click', this.handleEditorClick)
    }

    return el
  }

  renderReaderItem($$) {
    let urlHelper = this.context.urlHelper
    let node = this.props.data

    let el = $$('div')
      .attr("data-id", this.props.entityId)
      .addClass('sc-entity-entry se-geofeature')
      .on('click', this.handleClick)

    let location = node.country
    if(node.name !== node.currentName && node.currentName) {
      location += ", " + node.currentName
    }

    let resourceLink = $$('a')
      .addClass('se-resource-external-link se-resource-link')
      .attr({
        href: urlHelper.openResource(this.props.entityId),
        target: '_blank',
        title: this.getLabel('resource-link')
      })
      .append(this.context.iconProvider.renderIcon($$, 'resources'))

    let mapLink = $$('a')
      .addClass('se-resource-external-link se-map-link')
      .attr({
        href: urlHelper.openMap(this.props.entityId),
        target: '_blank',
        title: this.getLabel('map-link')
      })
      .append(this.context.iconProvider.renderIcon($$, 'map-link'))

    el.append(
      $$('div').addClass('se-title').append(node.name),
      $$('div').addClass('se-location').append(location),
      resourceLink,
      mapLink,
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    return el
  }

  editEntity(e) {
    e.preventDefault()
    e.stopPropagation()
    this.send('editEntity', this.props.entityId)
  }

  handleEditorClick() {
    this.send('focusEntity', this.props.entityId)
    this.send('showReferences', this.props.entityId)
  }

  handleClick() {
    this.send('switchActive', this.props.entityType, this.props.entityId)
    this.send('showReferences', this.props.entityId)
  }

}

export default GeofeatureContextItem
