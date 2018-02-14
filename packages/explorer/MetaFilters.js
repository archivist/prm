import { Component } from 'substance'
import { forEach, isEmpty, isUndefined } from 'lodash-es'

class MetaFilters extends Component {
  didMount() {
    this._loadOptionValues()
  }

  didUpdate() {
    window.multirange.init()
  }

  getInitialState() {
    return {
      detentionPlaceTypes: [
        "рабочий лагерь", 
        "штрафной лагерь", 
        "концентрационный лагерь",
        "лагерь смерти",
        "тюрьма",
        "частное хозяйство (ферма)",
        "частный дом (город)"
      ],
      forcedLaborTypes: [
        "Промышленность и строительство",
        "↳ Производство и хранение оружия",
        "↳ Добыча ископаемых",
        "↳ Железная дорога, транспорт",
        "↳ Металлургия",
        "↳ Строительство",
        "↳ Землеустроительные работы",
        "↳ Судоверфи",
        "↳ Авиационная промышленность",
        "↳ Станкостроение и приборостроение",
        "↳ Текстильная промышленность",
        "↳ Пищевая промышленность",
        "↳ Лесная промышленность",
        "↳ Химический завод",
        "Сельское хозяйство",
        "Частный сектор и сфера услуг"
      ],
      project: [],
      state: [
        "военнопленный",
        "ост"
      ],
      militaryService: [
        "да",
        "нет"
      ],
      sex: [
        "мужчина",
        "женщина"
      ],
      recordType: [
        'Видео',
        'Аудио'
      ],
      placeOfBirth: [],
      yearOfBirth: [],
      enslavingYear: [],
      homecomingYear: []
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

    let detentionPlaceTypeFilter = this.renderSelectList($$, this.state.detentionPlaceTypes, 'interviewee_detention_place_type', 'detention_place_type', 'array')
      .ref('detentionPlaceTypeFilter')
    let forcedLaborTypeFilter = this.renderSelectList($$, this.state.forcedLaborTypes, 'interviewee_forced_labor_type', 'forced_labor_type', 'array')
      .ref('forcedLaborTypeFilter')
    let stateFilter = this.renderRadioGroup($$, this.state.state, filters.interviewee_state, 'interviewee_state', 'state-filter')
      .ref('stateFilter')
    let militaryServiceFilter = this.renderRadioGroup($$, this.state.militaryService, filters.interviewee_military_service, 'interviewee_military_service', 'military_service-filter')
      .ref('militaryServiceFilter')
    let sexFilter = this.renderRadioGroup($$, this.state.sex, filters.interviewee_sex, 'interviewee_sex', 'sex-filter')
      .ref('sexFilter')
    let placeOfBirthFilter = this.renderSelectList($$, this.state.placeOfBirth, 'interviewee_place_of_birth', 'place_of_birth-filter')
      .ref('placeOfBirthFilter')
    let yearOfBirthFilter = this.renderSelectList($$, this.state.yearOfBirth, 'interviewee_year_of_birth', 'year_of_birth-filter')
      .ref('yearOfBirthFilter')
    let enslavingYearFilter = this.renderSelectList($$, this.state.enslavingYear, 'interviewee_enslaving_year', 'enslaving_year-filter')
      .ref('enslavingYearFilter')
    let homecomingYearFilter = this.renderSelectList($$, this.state.homecomingYear, 'interviewee_homecoming_year', 'homecoming_year-filter')
      .ref('homecomingYearFilter')
    let interviewDateFilter = this.renderRangeSlider($$, [1988,2011], filters.interview_date, 'interview_date', 'interview_date-filter', 'range')
      .ref('interviewDateFilter')
    let recordTypeFilter = this.renderRadioGroup($$, this.state.recordType, filters.record_type, 'record_type', 'record_type-filter')
      .ref('recordTypeFilter')
    let projectFilter = this.renderSelectList($$, this.state.project, 'project', 'project-filter')
      .ref('projectFilter')

    el.append(
      detentionPlaceTypeFilter,
      forcedLaborTypeFilter,
      stateFilter,
      militaryServiceFilter,
      sexFilter,
      placeOfBirthFilter,
      yearOfBirthFilter,
      enslavingYearFilter,
      homecomingYearFilter,
      interviewDateFilter,
      recordTypeFilter,
      projectFilter
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
      let option = $$('option').attr({value: opt.replace('↳ ', '')}).append(opt.replace('↳ ', ''))
      if(opt.replace('↳ ', '') === filters[id]) option.attr({selected: true})
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
      "interviewee_place_of_birth",
      "interviewee_year_of_birth",
      "interviewee_enslaving_year",
      "interviewee_homecoming_year",
      "project"
    ]
    documentClient.loadMetaOptionValues(props, (err, res) => {
      if (err) {
        console.error('Option values could not be loaded', err)
        return
      }

      this.extendState({
        placeOfBirth: res.interviewee_place_of_birth,
        yearOfBirth: res.interviewee_year_of_birth,
        enslavingYear: res.interviewee_enslaving_year,
        homecomingYear: res.interviewee_homecoming_year,
        project: res.project
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