import { Component } from 'substance'

class ResourceReference extends Component {

  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadResourceFragments': this._loadResourceFragments
    })
  }

  didMount() {
    this._loadResourceData()
    this._loadResourceDocuments()
  }

  render($$) {
    let el = $$('div').addClass('sc-resources')
    el.append(
      this.renderResource($$),
      this.renderDocumentList($$)
    )

    return el
  }

  renderResource($$) {
    let el = $$('div').addClass('se-resource')
    let resource = this.state.resource

    if(resource) {
      let title = resource.name

      el.append(
        $$('div').addClass('se-title').setInnerHTML(title),
        $$('div').addClass('se-description').setInnerHTML(resource.description)
      )
    }

    return el
  }

  renderDocumentList($$) {
    let Grid = this.getComponent('grid')
    let items = this.state.documents
    let resource = this.state.resource
    let isTopic = resource ? resource.entityType === 'topic' : false
    let DocumentItem = this.getComponent('document-item')
    let grid = $$(Grid)

    if(items && this.props.mobile) {
      grid.append(
        $$('div').addClass('se-total').append(
          this.getLabel('total-results') + ': ' + items.length
        ).ref('total')
      )
    }

    if(items) {
      items.forEach((item, index) => {
        let active = this.state.details === index
        grid.append(
          $$(DocumentItem, {item: item, index: index, active: active, resource: this.props.resource, topic: isTopic})
            .ref(item.documentId)
        )
      })
      this.send('setTotal', items.length)
    }

    return grid
  }

  _loadResourceData() {
    let resourceId = this.props.resource
    let resourceClient = this.context.resourceClient

    resourceClient.getEntity(resourceId, (err, resource) => {
      if(err) {
        console.log(err)
        return
      }
      this.extendState({
        resource: resource
      })
    })
  }

  _loadResourceDocuments() {
    let resourceId = this.props.resource
    let documentClient = this.context.documentClient

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.err(err)
        return
      }

      this.extendState({
        documents: docs
      })
    })
  }

  /*
    Loads resource related fragments
  */
  _loadResourceFragments(documentId, index) {
    if(!this.state.resource) {
      return
    }

    let filters = {
      "resources": [this.props.resource]
    }
    let options = {}
    let documentClient = this.context.documentClient
    let items = this.state.documents

    if(!items[index].fragments) {
      documentClient.loadFragments(documentId, filters, options, function(err, fragments) {
        if (err) {
          console.error('Search results could not be loaded', err)
          return
        }

        items[index].fragments = fragments

        this.extendState({
          documents: items,
          details: index
        })
      }.bind(this))
    } else {
      this.extendState({details: index})
    }
  }
}

export default ResourceReference
