import { Component } from 'substance'
import { each, filter, find, isEmpty, sortBy } from 'lodash-es'
import moment from 'moment'

class Sidebar extends Component {

  willReceiveProps(props) {
    if(props.location && props.location !== this.props.location) {
      this._loadLocationData(props.location, props.locations)
    }
  }

  render($$) {
    let details = this.props.location ? true : false
    let el = $$('div').addClass('sc-map-sidebar')

    el.append(this.renderHeader($$))

    if(details) {
      el.append(this.renderDetails($$))
    } else {
      el.append(this.renderList($$))
    }

    el.append(this.renderFilters($$))

    return el
  }

  renderHeader($$) {
    let details = this.props.location ? true : false

    let header = $$('div').addClass('se-sidebar-header')
    let mode = details ? 'sidebar-back' : 'sidebar-click'

    header.append(
      this.context.iconProvider.renderIcon($$, mode),
      this.getLabel(mode)
    )

    if(details) {
      header.on('click', this._showLocationsList)
    }

    return header
  }

  renderList($$) {
    let el = $$('div').addClass('se-locations-list')
    let locations = this.props.locations
    if(!isEmpty(locations)) {
      let filters = []
      each(this.props.filters, (f, id) => {
        if(f.state === true) filters.push(id)
      })
      let features = filter(locations.features, function(f) {
        const featureType = f.properties.featureType
        const intersection = featureType.filter(value => -1 !== filters.indexOf(value))
        return intersection.length > 0
      })
      features = sortBy(features, function(f) { return f.properties.name })
      features.forEach(f => {
        let item = $$('div').addClass('se-location-item').append(
          $$('div').attr({class: 'se-title'}).append(f.properties.name),
          $$('div').attr({class: 'se-stats'}).append(f.properties.stats)
        ).on('click', this._showLocation.bind(this, f.properties.entityId))
        el.append(item)
      })
    }

    return el
  }

  renderDetails($$) {
    let location = this.state.location
    let urlHelper = this.context.urlHelper
    let el = $$('div').addClass('se-location-details')

    if(location) {
      el.append(this.renderToponym($$))

      let references = $$('div').addClass('se-references')
      each(location.docs, doc => {
        let refItem = $$('a').addClass('se-doc-reference')
          .attr({
            href: urlHelper.openDocument(doc.documentId, this.props.location),
            target: '_blank'
          })
        let metaInfo = $$('div').addClass('se-doc-meta')
        if(doc.state !== 'published') refItem.addClass('sm-unpublished')
        if(doc.interview_duration) {
          metaInfo.append($$('div').addClass('se-record-duration').append(doc.interview_duration + ' ' + this.getLabel('min-duration')))
        }
        if(doc.interview_date) {
          metaInfo.append($$('div').addClass('se-record-date').append(moment(doc.interview_date).format('DD.MM.YYYY')))
        }
        if(doc.record_type) {
          metaInfo.append($$('div').addClass('se-record-type').append(this.context.iconProvider.renderIcon($$, doc.record_type)))
        }
        if(doc.count) {
          metaInfo.append($$('div').addClass('se-fragments-count').append(doc.count + ' ' + this.getLabel('fragment-count')))
        }

        refItem.append(
          metaInfo,
          $$('div').addClass('se-doc-title').append(doc.title)
        )

        references.append(refItem)
      })
      el.append(references)
    }

    return el
  }

  renderToponym($$) {
    let el = $$('div').addClass('se-location-meta se-toponym')
    let loc = this.state.location
    let node = loc.properties
    el.append(
      $$('div').addClass('se-title').append(node.name.toLowerCase() === 'неизвестно' ? this.getLabel('unknown-name') : node.name),
      $$('div').attr({class: 'se-stats'}).append(
        this.context.iconProvider.renderIcon($$, 'sidebar-stats'),
        node.stats
      ),
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    return el
  }

  renderFilters($$) {
    let el = $$('div').addClass('se-filters')
    let filters = this.props.filters

    each(filters, (f, id) => {
      let icon
      if (id === 'ординарное место') {
        icon = 'globe'
      } else if (id === 'место взятия интервью') {
        icon = 'map-pin'
      } else if (id === 'место исторических событий') {
        icon = 'map-marker'
      } else if (id === 'место коммеморации') {
        icon = 'male'
      }
      let filterEl = $$('div').addClass('se-filter-item se-filter-' + id).append(
        $$('i').addClass('se-symbol fa fa-' + icon),
        id + ' (' + f.counter + ')'
      ).on('click', this.send.bind(this, 'filterLocations', id, !f.state))

      if(f.state) {
        filterEl.append(this.context.iconProvider.renderIcon($$, 'filter-visible').addClass('se-visibility'))
        filterEl.addClass('sm-active')
      } else {
        filterEl.append(this.context.iconProvider.renderIcon($$, 'filter-hidden').addClass('se-visibility'))
      }

      el.append(filterEl)
    })

    return el
  }

  _showLocation(id) {
    this.send('showLocation', id)
  }

  _showLocationsList() {
    this.send('showLocations')
  }

  _loadLocationData(resourceId, locations) {
    let documentClient = this.context.documentClient
    locations = locations || this.props.locations
    let location = find(locations.features, f => {
      return f.properties.entityId === resourceId
    })

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.err(err)
        return
      }
      location.docs = docs
      this.extendState({
        location: location
      })
    })
  }
}

export default Sidebar
