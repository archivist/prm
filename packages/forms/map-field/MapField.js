import { Component } from 'substance'
import { each } from 'lodash-es'
import L from 'leaflet'
import 'leaflet-control-geocoder'

class MapField extends Component {
  didMount() {
    this._initMap()
  }

  getInitialState() {
    return {
      defaultLocation: [48.6, 18.8],
      defaultZoom: 5,
    }
  }

  getGeocoders() {
    let geocoders = {
      'Google': L.Control.Geocoder.google('AIzaSyC5W2oY1NB6pWI0RATM8BhkPdfxNWnlg4o', {geocodingQueryParams: {language: 'ru'}, reverseQueryParams: {language: 'ru'}}),
      'Nominatim': L.Control.Geocoder.nominatim(),
      'Bing': L.Control.Geocoder.bing('AoArA0sD6eBGZyt5PluxhuN7N7X1vloSEIhzaKVkBBGL37akEVbrr0wn17hoYAMy')
    }

    return geocoders
  }

  render($$) {
    let config = this.props.config
    let el = $$('div').addClass('sc-field-map sc-field-' + this.props.fieldId)

    let map = $$('div').addClass('se-map')
        .attr({id: 'map'})
        .ref('map')

    el.append(
      map,
      $$('div').attr({id: 'geocode-selector'}),
      $$('div').addClass('help').append(config.placeholder)
    )

    return el
  }

  setValue(value) {
    // TODO: fix array reverse bug, sometimes coordinates got reversed on map update
    if(value) {
      if(value.length > 0) {
        this.map.setView({lat: value[0], lng: value[1]}, this.state.defaultZoom)
        this.control._geocodeMarker = L.marker(value).addTo(this.map)
      }
    }
  }

  getValue() {
    let latlng = this.control._geocodeMarker.getLatLng()
    return [latlng.lat, latlng.lng]
  }

  geocode(value) {
    this.control.options.geocoder.geocode(value, this._onGeocode, this)
  }

  _initMap() {
    this.map = L.map('map').setView(this.state.defaultLocation, this.state.defaultZoom)
      .on('click', this._onClick.bind(this))

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: '10',
      minZoom: '4',
      attributionControl: false
    }).addTo(this.map)

    this.control = L.Control.geocoder()
      .on('markgeocode', this._onGeocode.bind(this))
    let geocoders = this.getGeocoders()
    let selector = L.DomUtil.get('geocode-selector')
    let self = this

    each(geocoders, (geocoder, name) => {
      let btn = L.DomUtil.create('button', 'leaflet-bar', selector)
      btn.innerHTML = name
      L.DomEvent.addListener(btn, 'click', function() {
        self._selectGeocoder(geocoder, this)
      }, btn)

      if (!this.selection) {
        this._selectGeocoder(geocoder, btn)
      }
    })

    this.control.addTo(this.map)

    let attribution = L.control.attribution({position: 'bottomleft'})
    attribution.setPrefix('')
    attribution.addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>')
    attribution.addTo(this.map)
  }

  _selectGeocoder(geocoder, el) {
    if(this.selection) {
      L.DomUtil.removeClass(this.selection, 'selected')
    }

    this.control.options.geocoder = geocoder
    L.DomUtil.addClass(el, 'selected')
    this.selection = el
  }

  _onGeocode(e) {
    let external = false

    if(e.constructor === Array) {
      e = e[0]
      external = true
    }

    if(e !== undefined) {
      let results = e.geocode ? e.geocode : e
      let props = results.properties
      if(props && !external) {
        each(props, prop => {
          if(prop.types) {
            if(prop.types[0] === 'country') {
              this.emit('map:point', 'country', prop.long_name)
            }
            if(prop.types[0] === 'locality') {
              this.emit('map:point', 'locality', prop.long_name)
            }
          }
        })
      }
      this.control._geocodeMarker = L.marker(results.center).bindPopup(results.html || results.name).addTo(this.map).openPopup()
      this._onChange()
    }
  }

  _onClick(e) {
    this.control.options.geocoder.reverse(e.latlng, this.map.options.crs.scale(this.map.getZoom()), results => {
      let r = results[0]
      if (r) {
        if (this.control._geocodeMarker) {
          this.map.removeLayer(this.control._geocodeMarker)
        }
        this._onGeocode(r)
      }
    })
  }

  _onChange() {
    let name = this.props.fieldId
    let value = this.getValue()
    this.emit('commit', name, value)
  }

}

export default MapField
