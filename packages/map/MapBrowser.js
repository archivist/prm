import { Component } from 'substance'
import { isEqual } from 'lodash-es'
import L from 'leaflet'
import Sidebar from './Sidebar'
//import MC from 'leaflet.markercluser'

class MapBrowser extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'showLocation': this._showLocation,
      'showLocations': this._showLocations,
      'filterLocations': this._filterLocations
    })
  }

  didMount() {
    this._loadData()
    this._initMap()
  }

  getInitialState() {
    return {
      filters: {
        'ординарное место': {
          counter: 0,
          state: true
        },
        'место взятия интервью': {
          counter: 0,
          state: true
        },
        'место исторических событий': {
          counter: 0,
          state: true
        },
        'место коммеморации': {
          counter: 0,
          state: true
        }
      },
      locations: {},
      location: this.props.resourceId,
      defaultLocation: [48.6, 18.8],
      defaultZoom: 5
    }
  }

  willUpdateState(newState) {
    if(!isEqual(newState.locations, this.state.locations)) {
      this._showLayers(newState.locations)
      let location = newState.location
      this.refs.sidebar.extendProps({
        locations: newState.locations,
        location: location
      })
      if(location) {
        this._showLocation(location, false, true)
      }
    }

    if(!isEqual(newState.location, this.state.location)) {
      this.refs.sidebar.extendProps({
        location: newState.location
      })
    }
  }

  shouldRerender() {
    return false
  }

  render($$) {
    let el = $$('div').addClass('sc-maps')
    let Header = this.getComponent('header')
    el.append(
      $$(Header),
      $$('div').addClass('se-map')
        .attr({id: 'map'})
        .ref('map'),
      $$(Sidebar, {
        filters: this.state.filters,
        locations: this.state.locations
        //location: this.state.location
      }).ref('sidebar')
    )

    return el
  }

  _initMap() {
    this.map = L.map('map').setView(this.state.defaultLocation, this.state.defaultZoom)

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: '10',
      minZoom: '4',
      attributionControl: false
    }).addTo(this.map)

    let attribution = L.control.attribution({position: 'bottomleft'})
    attribution.setPrefix('')
    attribution.addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>')
    attribution.addTo(this.map)
  }

  _showLayers(locations, filters, silent) {
    filters = filters || this.state.filters
    this.geojson = L.geoJSON(locations, {
      filter: feature => {
        let types = feature.properties.featureType
        let visible = false
        types.forEach(type => {
          const state = filters[type].state
          if(state) visible = true
        })
        return visible
      },
      coordsToLatLng: coords => {
        return new L.LatLng(coords[0], coords[1])
      }
    })

    this.geojson.eachLayer(layer => {
      let types = layer.feature.properties.featureType
      types.forEach(type => {
        if(!silent) this.state.filters[type].counter++
        layer.setIcon(this._renderIcon(type))
        this._prepareFeature(layer)
      })
    })

    this.markers = L.markerClusterGroup({disableClusteringAtZoom: 11})
    this.markers.on('clusterclick', e => {
      if(this.map.getZoom() === this.map.getMaxZoom()) e.layer.spiderfy()
    })
    this.markers.on('mouseover', e => {
      e.layer.openPopup()
    })
    this.markers.on('mouseout', e => {
      setTimeout(function(){
        e.layer.closePopup()
      }, 300)
    })
    this.markers.on('click', e => {
      let id = e.layer.feature.properties.entityId
      this._showLocation(id, e.layer)
    })
    this.markers.addLayer(this.geojson)
    this.map.addLayer(this.markers)
  }

  _renderIcon(type) {
    let icon
    if (type === 'ординарное место') {
      icon = 'globe'
    } else if (type === 'место взятия интервью') {
      icon = 'microphone'
    } else if (type === 'место исторических событий') {
      icon = 'map-marker'
    } else if (type === 'место коммеморации') {
      icon = 'male'
    }
    return L.divIcon({
      className: 'icon icon-' + type,
      html: '<i class="fa fa-' + icon +'"></i>',
      iconSize: [30, 30],
      popupAnchor: [0, -15]
    })
  }

  _prepareFeature(layer) {
    let props = layer.feature.properties

    props.stats = this.getLabel('map-documents') + ': ' + props.documents + ', ' + this.getLabel('map-mentions') + ': ' + props.fragments
    let popupContent = `<h3>${props.name}</h3><p class="se-stats">${props.stats}</p>`

    layer.bindPopup(popupContent)
  }

  _showLocation(id, layer, silent) {
    if(!silent) {
      this.extendState({
        location: id
      })
    }
    if(!layer) {
      this.geojson.eachLayer(l => {
        if(l.feature.properties.entityId === id) {
          layer = l
        }
      })
    }
    let urlHelper = this.context.urlHelper
    urlHelper.focusMapResource(id)
    this._focusOnLocation(layer)
  }

  _showLocations() {
    this.extendState({
      location: undefined
    })
    let urlHelper = this.context.urlHelper
    urlHelper.focusMapResource()
    this.map.setView(this.state.defaultLocation, this.state.defaultZoom)
  }

  _filterLocations(filter, state) {
    let filters = this.state.filters
    filters[filter].state = state
    this.markers.clearLayers()
    this._showLayers(this.state.locations, filters, true)
    this.refs.sidebar.extendProps({
      filters: filters
    })
    if(this.state.location) this._showLocations()
  }

  _focusOnLocation(marker) {
    let cM = this.map.project(marker.getLatLng(), 10)
    cM.x += 175
    let point = this.map.unproject(cM, 10)
    this.map.setView(point, 10, {animate: true})
  }

  _loadData() {
    let resourceClient = this.context.resourceClient

    resourceClient.getLocationsList((err, geojson) => {
      if(err) {
        console.err(err)
        return
      }
      this.extendState({
        locations: geojson
      })
    })
  }
}

export default MapBrowser
