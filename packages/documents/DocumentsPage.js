import { Component, FontAwesomeIcon as Icon, SplitPane, SubstanceError as Err } from 'substance'
import { concat, each, find, findIndex, isEmpty, isEqual } from 'lodash-es'
import moment from 'moment'

// Sample data for debugging
// import DataSample from '../../data/docs'

class DocumentsPage extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      // 'newDocument': this._createDocument,
      'newProDocument': this._createProDocument,
      'newVolunteerDocument': this._createVolunteerDocument,
      'filter': this._onFilter
    })
  }

  didMount() {
    document.title = this.getLabel('documents')
    this._loadData()
  }

  didUpdate(oldProps, oldState) {
    if(oldState.search !== this.state.search || !isEqual(oldState.filters, this.state.filters) || oldState.direction !== this.state.direction) {
      this.searchData()
    }
  }

  getInitialState() {
    return {
      filters: {},
      additionalFilters: false,
      search: '',
      perPage: 30,
      order: '"updatedAt"',
      direction: 'desc',
      pagination: false,
      items: []
    }
  }

  // willReceiveProps() {
  //   this._loadData()
  // }

  render($$) {
    let documentItems = this.state.items
    let el = $$('div').addClass('sc-documents')
    let main = $$('div').addClass('se-entity-layout')

    let header = this.renderHeader($$)

    let toolbox = this.renderToolbox($$)
    main.append(
      toolbox,
      this.renderAdditionalFilters($$)
    )

    if (documentItems) {
      if (documentItems.length > 0) {
        main.append(this.renderFull($$))
      } else {
        main.append(this.renderEmpty($$))
      }
    }

    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '40px'}).append(
        header,
        main
      )
    )
    return el
  }

  renderFilters($$) {
    const PageFilter = this.getComponent('page-filter')
    const Input = this.getComponent('input')
    let filters = []
    let search = $$('div').addClass('se-search').append(
      $$(Icon, {icon: 'fa-search'})
    )
    let searchInput = $$(Input, {type: 'search', placeholder: this.getLabel('search-placeholder')})
      .ref('searchInput')

    if(this.isSearchEventSupported()) {
      searchInput.on('search', this._onSearch)
    } else {
      searchInput.on('keypress', this._onSearchKeyPress)
    }
    search.append(searchInput)
    filters.push(search)

    // let additionalFiltersToggle = $$('button').addClass('se-filter-toggle').append(
    //   $$(Icon, {icon: 'fa-filter'})
    // ).ref('filtersToggle').on('click', this._toggleAdditionalFilters)

    let directionIcon = this.state.direction === 'desc' ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc'

    let createdSort = $$('div').addClass('se-updated-sort se-sort').append(
      $$('div').addClass('se-label').append(this.getLabel('sort-updated'))
    ).on('click', this._onSort.bind(this, '"updatedAt"'))

    if(this.state.order === '"updatedAt"') {
      createdSort.addClass('se-active').append(
        $$('div').addClass('se-icon').append(
          $$(Icon, {icon: directionIcon})
        )
      )
    }

    let alphabetSort = $$('div').addClass('se-alphabet-sort se-sort').append(
      $$('div').addClass('se-label').append(this.getLabel('sort-alphabet'))
    ).on('click', this._onSort.bind(this, 'title'))

    if(this.state.order === 'title') {
      alphabetSort.addClass('se-active').append(
        $$('div').addClass('se-icon').append(
          $$(Icon, {icon: directionIcon})
        )
      )
    }

    filters.push(
      $$(PageFilter, {
        id: 'meta->>state',
        type: 'dropdown',
        default: 'select-document-state',
        options: ['published', 'finished', 'verified', 'transcripted']
      }).ref('stateFilter'),
      $$(PageFilter, {
        id: 'meta->>interview_record_type',
        type: 'buttons',
        options: [
          {id: 'audio', icon: 'fa-volume-up'},
          {id: 'video', icon: 'fa-video-camera'}
        ]
      }).ref('recordTypeFilter'),
      $$('div').addClass('se-sort-wrapper').append(createdSort, alphabetSort)
    )

    return filters
  }

  renderAdditionalFilters($$) {
    const PageFilter = this.getComponent('page-filter')
    let filtersPanel = $$('div').addClass('se-additional-filters').append(
      $$(PageFilter, {
        id: 'meta->>interview_type',
        type: 'dropdown',
        default: 'select-interview-type',
        options: ['волонтерское', 'профессиональное']
      }).ref('typeFilter'),
      $$(PageFilter, {
        id: 'meta->>respondent_sex',
        type: 'dropdown',
        default: 'select-respondent-sex',
        options: ['мужчина', 'женщина']
      }).ref('respondentSexFilter'),
      $$(PageFilter, {
        id: 'meta->>respondent_year_of_birth',
        type: 'dropdown',
        default: 'select-birth-year',
        distinct: 'respondent_year_of_birth'
      }).ref('birthYearFilter'),
      $$(PageFilter, {
        id: 'meta->>interview_location',
        type: 'reference',
        entityType: 'geofeature',
        multi: true,
        label: 'interview-location-filter-label',
        default: 'interview-location-filter-default'
      }).ref('interviewLocationFilter'),
      $$(PageFilter, {
        id: 'annotations @>',
        type: 'reference',
        entityType: 'topic',
        multi: true,
        label: 'interview-topic-filter-label',
        default: 'interview-topic-filter-default'
      }).ref('interviewTopicsFilter'),
      $$(PageFilter, {
        id: 'meta->>collection',
        type: 'reference',
        entityType: 'collection',
        label: 'interview-collection-filter-label',
        default: 'interview-collection-filter-default'
      }).ref('interviewCollectionFilter')
    ).ref('filters')

    return filtersPanel
  }

  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: 'archive'})
  }

  renderToolbox($$) {
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let role = user.role

    let Toolbox = this.getComponent('toolbox')
    let filters = this.renderFilters($$)
    let actions = {}

    if(role === 'admin') {
      actions = {
        'newProDocument': this.getLabel('add-pro-document'),
        'newVolunteerDocument': this.getLabel('add-volunteer-document')
      }
    } else if (role === 'volunteer') {
      actions = {
        'newVolunteerDocument': this.getLabel('add-volunteer-document')
      }
    }

    let toolbox = $$(Toolbox, {
      actions: actions,
      content: filters
    }).ref('toolbox')

    return toolbox
  }

  _toggleAdditionalFilters() {
    const filters = this.refs.filters
    const filtersToggle = this.refs.filtersToggle
    const filterState = filters.el.getStyle('display')
    const newState = filterState === 'none' ? 'block' : 'none'
    filters.el.setStyle('display', newState)
    if(newState === 'none') {
      filtersToggle.el.removeClass('sm-active')
    } else {
      filtersToggle.el.addClass('sm-active')
    }
  }

  renderStatusBar($$) {
    let componentRegistry = this.context.componentRegistry
    let StatusBar = componentRegistry.get('status-bar')

    return $$(StatusBar)
  }

  renderEmpty($$) {
    const Layout = this.getComponent('layout')
    let layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    })

    if(this.state.total === 0) {
      layout.append(
        $$('h1').html(
          'No results'
        ),
        $$('p').html('Sorry, no entities matches your query')
      )
    } else {
      let Spinner = this.getComponent('spinner')
      layout.append($$(Spinner, {message: 'spinner-loading'}))
    }

    return layout
  }

  renderAdditionalMenu($$, actions) {
    const Button = this.getComponent('button')
    let el = $$('div').addClass('se-more').attr({'tabindex': 0})
    let actionsList = $$('ul').addClass('se-more-content')
    each(actions, action => {
      actionsList.append(
        $$('li').addClass('se-more-item').append(
          $$(Button, {label: action.label}).on('click', action.action)
        )
      )
    })
    el.append(actionsList)

    return el
  }

  renderFull($$) {
    let urlHelper = this.context.urlHelper
    let items = this.state.items
    let total = this.state.total
    let Pager = this.getComponent('pager')
    let Grid = this.getComponent('grid')
    let grid = $$(Grid)

    if (items) {
      items.forEach(function(item, index) {
        let url = urlHelper.openDocument(item.documentId)
        let documentIcon = $$(Icon, {icon: 'fa-file-text-o'})
        let title = $$('a').attr({href: url}).append(item.title)
        let updatedFromNow = moment(item.updatedAt).fromNow()
        let updatedDateTime = moment(item.updatedAt).format('DD.MM.YYYY HH:mm')
        let updatedAt = this.getLabel('updated-info')
          .replace('fromnow', updatedFromNow)
          .replace('datetime', updatedDateTime)
          .replace('username', item.updatedBy)
        let className = item.summary ? 'se-expanded' : ''

        let additionalActions = [
          {label: this.getLabel('delete-action'), action: this._removeItem.bind(this, item.documentId)},
        ]

        let row = $$(Grid.Row).addClass('se-document-meta ' + className).ref(item.documentId).append(
            $$(Grid.Cell, {columns: 1}).addClass('se-badge').append(documentIcon),
            $$(Grid.Cell, {columns: 5}).addClass('se-title').append(title),
            $$(Grid.Cell, {columns: 3}).append(updatedAt),
            $$(Grid.Cell, {columns: 2}).append(item.count ? item.count + ' fragments' : item.state),
            $$(Grid.Cell, {columns: 1}).addClass('se-additional').append(
              this.renderAdditionalMenu($$, additionalActions)
            ).on('click', function(e) {
              e.stopPropagation()
            })
        ).on('click', this._loadFragments.bind(this, item.documentId, index))

        if(item.summary) {
          row.append(
            $$(Grid.Row).addClass('se-document-summary').append(
              $$(Grid.Cell, {columns: 12}).addClass('se-summary').append(item.summary)
            )
          )
        }

        grid.append(row)

        if(this.state.details === index && item.fragments) {
          item.fragments.forEach(function(fragment) {
            let fragmentIcon = $$(Icon, {icon: 'fa-comments-o'})
            grid.append(
              $$(Grid.Row).addClass('se-document-fragment').append(
                $$(Grid.Cell, {columns: 1}).addClass('se-badge').append(fragmentIcon),
                $$(Grid.Cell, {columns: 11}).addClass('se-fragment').append($$('p').setInnerHTML(fragment.content))
              )
            )
          })
        }
      }.bind(this))
    }

    if(total > this.state.perPage) {
      grid.append(
        $$(Pager, {
          total: total,
          loaded: items.length
        })
      )
    }

    return grid
  }

  _createProDocument() {
    this._createDocument('профессиональное')
  }

  _createVolunteerDocument() {
    this._createDocument('волонтерское')
  }

  _createDocument(interviewType) {
    let authClient = this.context.authenticationClient
    let documentClient = this.context.documentClient
    let user = authClient.getUser()
    let interview = {
      schemaName: 'archivist-interview',
      schemaVersion: '1.0.0',
      info: {
        title: 'Untitled',
        userId: user.userId
      }
    }
    if(interviewType) {
      interview.interviewType = interviewType
    }


    documentClient.createDocument(interview, (err, result) => {
      this.send('navigate', {
        page: 'documents',
        documentId: result.documentId
      })
    })
  }

  _removeItem(id) {
    this._removeAttachedFiles(id, err => {
      if(err) {
        console.error(err)
      } else {
        let documentClient = this.context.documentClient
        documentClient.deleteDocument(id, err => {
          if(err) console.error(err)
          this._loadData()
        })
      }
    })
  }

  _removeAttachedFiles(id, cb) {
    const fileClient = this.context.fileClient
    const items = this.state.items
    const doc = find(items, item => { return item.documentId === id })
    const files = doc.files
    fileClient.deleteFiles(files, cb)
  }

  /*
    Search documents
  */
  searchData() {
    let searchValue = this.state.search

    if(isEmpty(searchValue)) {
      return this._loadData()
    }

    let language = 'russian'
    let filters = this.state.filters
    // let dataFilters = {}
    // if(filters.documentState) {
    //   dataFilters = {'meta->>state': filters.documentState}
    // }
    let perPage = this.state.perPage
    let pagination = this.state.pagination
    let options = {
      limit: perPage,
      offset: pagination ? this.state.items.length : 0
    }
    let items = []
    let documentClient = this.context.documentClient
    documentClient.searchDocuments(searchValue, language, filters, options, function(err, docs) {
      if (err) {
        this.setState({
          error: new Err('DocumentsPage.SearchError', {
            message: 'Search results could not be loaded.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      let details = findIndex(docs.records, function(record) {
        return record.fragments
      })

      if(pagination) {
        items = concat(this.state.items, docs.records)
      } else {
        items = docs.records
      }

      this.extendState({
        items: items,
        total: parseInt(docs.total, 10),
        details: details
      })
    }.bind(this))
  }

  /*
    Load more data
  */
  _loadMore() {
    this.extendState({
      pagination: true
    })
    this.searchData()
  }

  /*
    Loads documents
  */
  _loadData() {
    let filters = this.state.filters
    // let dataFilters = {}
    // if(filters.documentState && filters.documentState !== 'all') {
    //   dataFilters = {'meta->>state': filters.documentState}
    // }
    let pagination = this.state.pagination
    let perPage = this.state.perPage
    let options = {
      limit: perPage,
      offset: pagination ? this.state.items.length : 0,
      order: this.state.order + ' ' + this.state.direction
    }
    let items = []

    let documentClient = this.context.documentClient

    documentClient.listDocuments(filters, options, function(err, docs) {
      if (err) {
        this.setState({
          error: new Err('DocumentsPage.LoadingError', {
            message: 'Documents could not be loaded.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      if(pagination) {
        items = concat(this.state.items, docs.records)
      } else {
        items = docs.records
      }

      this.extendState({
        items: items,
        total: parseInt(docs.total, 10)
      })
    }.bind(this))
  }

  _loadFragments(documentId, index) {
    let searchValue = this.state.search

    if(isEmpty(searchValue)) {
      return
    }

    let language = 'russian'
    let filters = {}
    let options = {}
    let documentClient = this.context.documentClient
    let items = this.state.items

    if(!items[index].fragments) {
      documentClient.searchFragments(documentId, searchValue, language, filters, options, function(err, fragments) {
        if (err) {
          this.setState({
            error: new Err('DocumentsPage.FragmentsSearchError', {
              message: 'Search results could not be loaded.',
              cause: err
            })
          })
          console.error('ERROR', err)
          return
        }

        items[index].fragments = fragments

        this.extendState({
          items: items,
          details: index
        })
      }.bind(this))
    } else {
      this.extendState({details: index})
    }
  }

  _onSearchKeyPress(e) {
    // Perform search query on pressing enter
    if (e.which === 13 || e.keyCode === 13) {
      let searchValue = this.refs['searchInput'].val()
      this.extendState({
        search: searchValue,
        pagination: false
      })
      return false;
    }
  }

  _onSearch() {
    let searchValue = this.refs['searchInput'].val()
    // let documentStateValue = this.refs['stateFilter'].val()
    // let filters = {}
    //filters['documentState'] = documentStateValue
    //if(documentStateValue === 'all') delete filters['documentState']
    this.extendState({
      //filters: filters,
      search: searchValue,
      pagination: false
    })
  }

  _onSort(order) {
    const currentDirection = this.state.direction
    let direction = currentDirection === 'asc' ? 'desc' : 'asc'
    this.extendState({
      direction: direction,
      order: order
    })
  }

  _onFilter(prop, value) {
    let filters = Object.assign({}, this.state.filters)
    filters[prop] = value
    if(!value || isEmpty(value)) {
      delete filters[prop]
    }
    this.extendState({filters: filters})
  }

  isSearchEventSupported() {
    let element = document.createElement('input')
    let eventName = 'onsearch'
    let isSupported = (eventName in element)

    return isSupported
  }
}

export default DocumentsPage
