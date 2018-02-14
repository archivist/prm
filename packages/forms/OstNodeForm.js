import { NodeForm } from 'archivist-js'
import { each } from 'lodash-es'
import OstForms from './OstForms'

class OstNodeForm extends NodeForm {
  constructor(...args) {
    super(...args)

    this.forms = new OstForms({configurator: this.context.configurator})
  }

  didMount() {
    each(this.fields, function(field, id) {
      if(field.config.placeholder) {
        field.config.placeholder = this.getLabel(field.config.placeholder)
      }

      if(field.config.type === 'text') {
        this.forms.addTextField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'prose') {
        field.value = field.value || '<p>' + field.config.placeholder + '</p>'
        this.forms.addRichTextArea(id, this.refs[id].getNativeElement())
        this.forms.setHTML(id, field.value)
      } else if(field.config.type === 'select') {
        this.forms.addSelectField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'tags') {
        this.forms.addTagsField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'multiple') {
        this.forms.addMultipleField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'toggle') {
        this.forms.addToggleField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'geocoded') {
        this.forms.addGeocodedField(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      } else if(field.config.type === 'map') {
        this.map = this.forms.addMap(id, this.refs[id].getNativeElement(), field.config)
        this.forms.setValue(id, field.value)
      }
    }.bind(this))

    this.forms.on('commit', this._commit, this)
    this.forms.on('document:changed', this._updateHtml, this)
    this.forms.on('geocode', this._geocode, this)
    this.forms.on('map:point', this._onSetPoint, this)
  }

  _updateHtml(params) {
    let editorId = params.editorId
    let editor = this.forms._editables[editorId]
    this._commit(editorId, editor.getHTML())
  }

  _geocode(name, value) {
    this.map.geocode(value)
  }

  _onSetPoint(name, value) {
    if(name === 'country') {
      let field = this.forms._editables.country
      if(field) {
        this.forms.setValue('country', value)
        this._commit('country', value)
      }
    }

    if(name === 'locality') {
      let field = this.forms._editables.nearestLocality
      if(field) {
        this.forms.setValue('nearestLocality', value)
        this._commit('nearestLocality', value)
      }
      field = this.forms._editables.currentName
      if(field) {
        this.forms.setValue('currentName', value)
        this._commit('currentName', value)
      }
    }
  }
}

export default OstNodeForm
