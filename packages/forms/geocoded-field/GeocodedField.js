import { Component, FontAwesomeIcon as Icon, InputPackage } from 'substance'

const { Input } = InputPackage

class GeocodedField extends Component {

  render($$) {
    let config = this.props.config
    let el = $$('div').addClass('sc-field-geocoded sc-field-' + this.props.fieldId)

    let input = $$(Input, {type: config.dataType, placeholder: config.placeholder})
      .ref('input')
      .on('change', this._onChange)
    
    el.append(
      input,
      $$('div').addClass('se-geocode').append(
        $$(Icon, {icon: 'fa fa-map-marker'})
      ).on('click', this._geocode),
      $$('div').addClass('help').append(config.placeholder)
    )
    
    return el
  }

  setValue(value) {
    this.refs.input.val(value)
  }

  getValue() {
    return this.refs.input.val()
  }

  _geocode() {
    let name = this.props.fieldId
    let value = this.getValue()
    this.emit('geocode', name, value)
  }

  _onChange() {
    let name = this.props.fieldId
    let value = this.getValue()
    this.emit('commit', name, value)
  }

}

export default GeocodedField