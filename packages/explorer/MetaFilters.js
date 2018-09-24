import { Component } from 'substance'
import { forEach, isEmpty, isUndefined } from 'lodash-es'

class MetaFilters extends Component {
  didMount() {
    this._loadOptionValues()
    this._loadInterviewLocations()
  }

  getInitialState() {
    return {
      interviewLocation: [],
      interviewType: [
        "профессиональное",
        "волонтерское"
      ],
      respondentSex: [
        "мужчина",
        "женщина"
      ],
      recordType: [
        'Видео',
        'Аудио'
      ],
      yearOfBirth: []
    }
  }

  render($$) {
    let filters = this.props.filters
    let el = $$('div').addClass('sc-meta-filters se-panel')
    el.append($$('div').addClass('se-title').append(
      this.getLabel('meta-filters-title')
    ))

    if(!isEmpty(filters)) {
      el.append(
        $$('div').addClass('se-reset').append(
          this.getLabel('reset-all-filters'),
          this.context.iconProvider.renderIcon($$, 'reset-filter')
        ).on('click', this._resetAllFilters.bind(this))
      )
    }

    let interviewLocationFilter = this.renderSelectList($$, this.state.interviewLocation, 'interview_location', 'interview_location-filter')
      .ref('interviewLocationFilter')
    let interviewTypeFilter = this.renderRadioGroup($$, this.state.interviewType, filters.interview_type, 'interview_type', 'interview_type-filter')
        .ref('interviewTypeFilter')
    let respondentSexFilter = this.renderRadioGroup($$, this.state.respondentSex, filters.respondent_sex, 'respondent_sex', 'respondent_sex-filter')
      .ref('sexFilter')
    let recordTypeFilter = this.renderRadioGroup($$, this.state.recordType, filters.interview_record_type, 'interview_record_type', 'interview_record_type-filter')
      .ref('recordTypeFilter')
    let yearOfBirthFilter = this.renderSelectList($$, this.state.yearOfBirth, 'respondent_year_of_birth', 'year_of_birth-filter')
      .ref('yearOfBirthFilter')

    el.append(
      interviewLocationFilter,
      interviewTypeFilter,
      respondentSexFilter,
      recordTypeFilter,
      yearOfBirthFilter
    )

    return el
  }

  renderSelectList($$, options, id, placeholder, type) {
    let filters = this.props.filters
    let label = this.getLabel(placeholder)
    let el = $$('div').addClass('se-filter').append(
      $$('div').addClass('se-label').append(label)
    )

    if(!isUndefined(filters[id])) {
      el.append(
        $$('div').addClass('se-reset').append(
          this.getLabel('reset-filter'),
          this.context.iconProvider.renderIcon($$, 'reset-filter')
        ).on('click', this._resetFilter.bind(this, id))
      )
    }

    let selector = $$('select').addClass('se-select-filter')
      .on('change', this._changeFilter.bind(this, id, type))

    if(!filters[id]) {
      selector.append(
        $$('option').attr({value: '', selected: true, disabled: true}).append(
          this.getLabel('select-option')
        )
      )
    }
    forEach(options, opt => {
      const value = opt.value || opt
      const label = opt.name || opt
      let option = $$('option').attr({value: value}).append(label)
      if(value === filters[id]) option.attr({selected: true})
      selector.append(option)
    })
    el.append(selector)
    return el
  }

  renderRadioGroup($$, options, value, id, placeholder) {
    let label = this.getLabel(placeholder)
    let el = $$('div').addClass('se-filter').append(
      $$('div').addClass('se-label').append(label)
    )

    if(!isUndefined(value)) {
      el.append(
        $$('div').addClass('se-reset').append(
          this.getLabel('reset-filter'),
          this.context.iconProvider.renderIcon($$, 'reset-filter')
        ).on('click', this._resetFilter.bind(this, id))
      )
    }

    let group = $$('ul').addClass('se-radio-filter')
    let i = 0
    forEach(options, opt => {
      let radio = $$('input').attr({type: 'radio', id: placeholder + '_' + i, value: opt, name: placeholder})
        .on('change', this._changeFilter.bind(this, id, false))
      if(opt === value || opt === 'да' && value === true || opt === 'нет' && value === false || opt === 'Видео' && value === 'video' || opt === 'Аудио' && value === 'audio' ) radio.attr({checked: true})
      group.append(
        $$('li').append(
          radio,
          $$('label').attr({for: placeholder + '_' + i}).append(opt)
        )
      )
      i++
    })
    el.append(group)
    return el
  }

  renderRangeSlider($$, range, value, id, placeholder, type) {
    let label = this.getLabel(placeholder)

    let rangeValues = value ? value.split(',') : range
    let el = $$('div').addClass('se-filter').append(
      $$('div').addClass('se-label').append(label + ' (' + rangeValues[0] + ' — ' + rangeValues[1] + ')')
    )

    if(!isUndefined(value)) {
      el.append(
        $$('div').addClass('se-reset').append(
          this.getLabel('reset-filter'),
          this.context.iconProvider.renderIcon($$, 'reset-filter')
        ).on('click', this._resetFilter.bind(this, id))
      )
    }

    let rangeInput = $$('input').addClass('se-range-filter').attr({
      type: "range",
      multiple: true,
      min: range[0],
      max: range[1],
      value: value || range.join(',')
    }).on('change', this._changeFilter.bind(this, id, type))

    el.append(
      rangeInput
    )

    return el
  }

  _loadOptionValues() {
    let documentClient = this.context.documentClient
    let props = [
      "respondent_year_of_birth"
    ]
    documentClient.loadMetaOptionValues(props, (err, res) => {
      if (err) {
        console.error('Option values could not be loaded', err)
        return
      }

      this.extendState({
        yearOfBirth: res.respondent_year_of_birth
      })
    })
  }

  _loadInterviewLocations() {
    let documentClient = this.context.documentClient
    documentClient.loadInterviewLocations((err, res) => {
      if (err) {
        console.error('Option values could not be loaded', err)
        return
      }

      this.extendState({
        interviewLocation: res.geo.sort(function (a, b) {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        }).map(g=>{return {name: g.name, value: g.entityId}})
      })
    })
  }

  _changeFilter(id, type, e) {
    let value = e.target.value
    let op = false
    if(type === 'array') {
      op = ' ~~'
    }
    if(value === 'да') value = true
    if(value === 'нет') value = false
    if(value === 'Видео') value = 'video'
    if(value === 'Аудио') value = 'audio'
    if(type === 'range') {
      this.send('applyDateRangeFilter', id, value)
    } else {
      this.send('applyMetaFilter', id, value, op)
    }
  }

  _resetFilter(id) {
    this.send('resetMetaFilter', id)
  }

  _resetAllFilters() {
    this.send('resetAllMetaFilters')
  }
}

export default MetaFilters
