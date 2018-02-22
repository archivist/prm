import { Component, FontAwesomeIcon as Icon } from 'substance'
import { isEmpty, isEqual } from 'lodash-es'

class PageFilter extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'selectEntity': this._onFilter,
      'closeResourceOperator': this._toggleResourceDialog
    })
  }

  didMount() {
    if(this.props.distinct) {
      this._fetchDistinctValues()
    }
  }

  didUpdate(props, state) {
    const filterType = this.props.type
    if(filterType === 'reference' && !isEqual(state.selected, this.state.selected)) {
      this._fetchEntities()
    }
  }

  render($$) {
    const filterType = this.props.type
    let el = $$('div').addClass('sc-filter')

    if(filterType === 'dropdown') {
      el.append(this._renderDropdown($$))
    } else if (filterType === 'buttons') {
      el.append(this._renderIconToggle($$))
    } else if (filterType === 'reference') {
      el.append(this._renderEntityReference($$))
    }

    return el
  }

  _renderDropdown($$) {
    const options = this.props.options || this.state.options || []
    let dropdownFilter = $$('select').addClass('se-dropdown-filter')
      .ref('dropdown')
      .on('change', this._onFilter)

    if(this.props.default) {
      dropdownFilter.append($$('option').attr('value', '').append(
        this.getLabel(this.props.default)
      ))
    }

    options.forEach(opt => {
      let option = $$('option').attr('value', opt).append(opt)
      let selected = this.state.selected
      if(opt === selected) option.attr('selected', 'selected')
      dropdownFilter.append(option)
    })

    return $$('div').addClass('se-dropdown').append(
      dropdownFilter
    )
  }

  _renderIconToggle($$) {
    const options = this.props.options
    let buttonsFilter = $$('div').addClass('se-buttons-filter')

    options.forEach(opt => {
      let option = $$('button').attr('value', opt.id).append(
        $$(Icon, {icon: opt.icon})
      ).on('click', this._onFilter.bind(this, opt.id))

      let selected = this.state.selected || []
      if(selected.indexOf(opt.id) > -1) {
        option.addClass('sm-active')
      }
      buttonsFilter.append(option)
    })

    return buttonsFilter
  }

  _renderEntityReference($$) {
    let referenceFilter = $$('div').addClass('se-reference-filter')
    let tagsWidget = $$('div').addClass('se-tags')
    const openDialog = this.state.openDialog || false
    const selected = this.state.selected || []
    const entities = this.state.entities || {}

    selected.forEach(entityId => {
      const entity = entities[entityId]
      const label = entity || 'unknown entity'
      let itemEl = $$('div').addClass('se-value')
        .append(label)
        .on('click', this._onFilter.bind(this, entityId))

      tagsWidget.append(itemEl)
    })

    if(isEmpty(selected)) {
      tagsWidget.append(
        $$('div').addClass('se-default-value')
          .append(this.getLabel(this.props.default))
          .on('click', this._toggleResourceDialog)
      )
    }

    if(openDialog) {
      const Modal = this.getComponent('modal')
      const ResourceOperator = this.getComponent('resource-operator')
      referenceFilter.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(ResourceOperator, {mode: 'search', entityType: this.props.entityType})
        ).ref('modal')
      )
    }

    referenceFilter.append(
      $$('div').addClass('se-toggle-dialog').append(
        $$('div').addClass('se-label').append(this.getLabel(this.props.label)),
        $$(Icon, {icon: 'fa fa-filter'})
      ).on('click', this._toggleResourceDialog),
      tagsWidget
    )

    return referenceFilter
  }

  _toggleResourceDialog() {
    const isOpen = this.state.openDialog || false
    this.extendState({openDialog: !isOpen})
  }

  _fetchEntities() {
    const resourceClient = this.context.resourceClient
    const entityIds = this.state.selected || []
    if(entityIds.length > 0) {
      resourceClient.listEntities({entityId: entityIds}, {columns: ['"entityId"', 'name']}, (err, res) => {
        if (err) return console.error(err)
        let entities = {}
        res.records.forEach(item => {
          entities[item.entityId] = item.name
        })
        this.extendState({entities: entities})
      })
    }
  }

  _fetchDistinctValues() {
    const distinct = this.props.distinct
    const documentClient = this.context.documentClient
    documentClient.getDistinctValues([distinct], (err, values) => {
      if (err) return console.error(err)
      const result = values[distinct]
      if(result) this.extendState({options: result})
    })
  }

  _onFilter(val) {
    const id = this.props.id
    const filterType = this.props.type
    if(filterType === 'dropdown') {
      let value = this.refs.dropdown.val()
      this.send('filter', id, value)
      this.extendState({'selected': value})
    } else if (filterType === 'buttons') {
      let values = (this.state.selected || []).slice(0)
      const valIndex = values.indexOf(val)
      if(valIndex > -1) {
        values.splice(valIndex, 1)
      } else {
        values.push(val)
      }
      this.send('filter', id, values)
      this.extendState({'selected': values})
    } else if (filterType === 'reference') {
      let values = (this.state.selected || []).slice(0)
      const valIndex = values.indexOf(val)
      const multi = this.props.multi
      if(valIndex > -1) {
        values.splice(valIndex, 1)
      } else {
        if(multi) {
          values.push(val)
        } else {
          values = [val]
        }
      }
      this.send('filter', id, values)
      this.extendState({'selected': values})
    }
  }
}

export default PageFilter
