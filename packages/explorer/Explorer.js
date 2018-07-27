import { Component, FontAwesomeIcon as Icon } from 'substance'
import { clone, concat, each, extend, findIndex, findLastIndex, isEmpty, isEqual, isUndefined } from 'lodash-es'

// Sample data for debugging
// import DataSample from '../../data/docs'

class Explorer extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadFragments': this._loadFragments,
      'loadMore': this._loadMore,
      'search': this._searchData,
      'openResource': this._showResource,
      'openTopic': this._showResource,
      'setTotal': this._setTotal,
      'changeTopicFacets': this._onTopicsChanged,
      'applyMetaFilter': this._applyMetaFilter,
      'applyDateRangeFilter': this._applyDateRangeFilter,
      'resetMetaFilter': this._resetMetaFilter,
      'resetAllMetaFilters': this._resetAllMetaFilters,
      'toogleSearch': this._toggleSearch
    })
  }

  didMount() {
    this.searchData(this.state)
    this._loadTopics(this.state.filters, this.state.search)
  }

  willUpdateState(state) {
    let oldFilters = this.state.filters
    let newFilters = state.filters

    if(!isEqual(oldFilters, newFilters) || !isEqual(this.state.search, state.search)) {
      this.searchData(state)
      this.searchResources(state.search)
      this.searchTopics(state.search)
      this._loadTopics(newFilters, state.search)
    }

    if(!this.state.topics && state.topics) {
      this.refs.facets.extendProps({
        topics: state.topics
      })
    }

    if(this.state.resource && !state.resource) {
      let urlHelper = this.context.urlHelper
      urlHelper._writeRoute('/', {})
    }

    if(state.resource && this.state.resource !== state.resource) {
      let urlHelper = this.context.urlHelper
      urlHelper.writeRoute({page: 'resources', resourceId: state.resource})
    }
  }

  shouldRerender(newProps, newState) {
    if(!this.state.topics && newState.topics) return false
    return true
  }

  getInitialState() {
    const search = this.props.search ? decodeURI(this.props.search) : ''
    const topicsList = this.props.topics
    const topics = topicsList ? topicsList.split(';') : []
    return {
      filters: {"meta->>'state'": "published", topics: topics},
      metaFilters: {},
      search: search,
      searchbox: true,
      resource: this.props.resourceId,
      perPage: 30,
      order: "meta->>'published_on' desc, \"documentId\" desc",
      pagination: false,
      showFilters: false,
      topics: [],
      items: []
    }
  }

  render($$) {
    let Layout = this.getComponent('layout')

    let documentItems = this.state.items
    let el = $$('div').addClass('sc-explorer')

    if (!documentItems) {
      return el
    }
    let Header = this.getComponent('header')
    el.append($$(Header, {searchbox: false}))

    let SearchBar = this.getComponent('searchbar')

    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left'
    }).addClass('se-explorer-layout')

    this._updateLayout()

    let resultsPane = $$('div').addClass('se-results-pane container')
    let searchPane = $$('div').addClass('se-search-pane').append(
      $$(SearchBar, {value: this.state.search})
    )

    if(this.props.mobile) {
      let navigationToggle = $$('div').addClass('se-navigation-toggle').append(
        $$(Icon, {icon: 'fa-bars'}).ref('headerIcon')
      ).on('click', this._toggleNavigation)

      if(this.state.showFilters) {
        resultsPane.append(
          this.renderSidebarSection($$)
        )
        navigationToggle.addClass('sm-active')
      } else {
        resultsPane.append(
          this.renderMainSection($$)
        )
      }

      searchPane.append(navigationToggle)
    } else {
      resultsPane.append(
        this.renderMainSection($$),
        this.renderSidebarSection($$)
      )
    }
    if(this.state.searchbox) {
      layout.append(searchPane)
    }

    layout.append(
      resultsPane
    )

    el.append(layout)

    let Footer = this.getComponent('footer')
    el.append($$(Footer))

    return el
  }

  renderMainSection($$) {
    const resource = this.state.resource
    const ResourceReference = this.getComponent('resource-reference')
    if(resource) {
      return $$(ResourceReference, {resource: resource, mobile: this.props.mobile})
    }


    let documentItems = this.state.items
    if (documentItems.length > 0) {
      return this.renderFull($$)
    } else {
      return this.renderEmpty($$)
    }
  }

  renderSidebarSection($$) {
    const topics = this.state.topics
    let el = $$('div').addClass('se-sidebar')
    let ResourceEntries = this.getComponent('resource-entries')
    let TopicEntries = this.getComponent('topic-entries')
    let MetaFilters = this.getComponent('meta-filters')
    let Facets = this.getComponent('facets')

    // if(this.state.total && !this.props.mobile) {
    //   el.append(
    //     $$('div').addClass('se-total').append(
    //       this.getLabel('total-results') + ': ' + this.state.total
    //     ).ref('total')
    //   )
    // }

    if(this.state.search) {
      if(!isEmpty(this.state.foundTopics)) el.append($$(TopicEntries, {entries: this.state.foundTopics}))
      if(!isEmpty(this.state.entries)) el.append($$(ResourceEntries, {entries: this.state.entries}))
    }

    if(topics.length > 0) {
      el.append(
        $$(Facets, {topics: topics, facets: this.state.filters.topics}).ref('facets')
      )
    }

    el.append(
      $$(MetaFilters, {filters: this.state.metaFilters}).ref('filters')
    )

    return el
  }

  renderEmpty($$) {
    let Layout = this.getComponent('layout')

    let layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    })

    if(this.state.total === 0) {
      layout.append(
        $$('h1').append(this.getLabel('no-results')),
        $$('p').append(this.getLabel('no-results-info'))
      )
    } else {
      layout.append(
        $$('div').addClass('se-spinner').append(
          $$('div').addClass('se-rect1'),
          $$('div').addClass('se-rect2'),
          $$('div').addClass('se-rect3'),
          $$('div').addClass('se-rect4'),
          $$('div').addClass('se-rect5')
        ),
        $$('h2').html(
          'Loading...'
        )
      )
    }

    return layout;
  }

  renderFull($$) {
    let Grid = this.getComponent('grid')

    let items = this.state.items
    let total = this.state.total
    let DocumentItem = this.getComponent('document-item')
    let Pager = this.getComponent('pager')
    let grid = $$(Grid)

    if(this.state.total && this.props.mobile) {
      grid.append(
        $$('div').addClass('se-total').append(
          this.getLabel('total-results') + ': ' + this.state.total
        ).ref('total')
      )
    }

    if(items) {
      items.forEach((item, index) => {
        let active = this.state.details === index
        grid.append(
          $$(DocumentItem, {item: item, index: index, active: active, topics: this.state.topics}).ref(item.documentId)
        )
      })
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

  /*
    Search documents
  */
  searchData(newState) {
    let filters = newState ? newState.filters : this.state.filters
    let searchValue = newState ? newState.search : this.state.search

    if(isEmpty(searchValue)) {
      return this._loadData(filters)
    }

    let language = 'russian'
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
        console.error('Search results could not be loaded', err)
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

  searchResources(query) {
    let searchQuery = query || this.props.query
    let resourceClient = this.context.resourceClient
    resourceClient.searchTopResources(searchQuery, 'russian', (err, entries) => {
      if(err) {
        console.error(err)
        return
      }
      this.extendState({
        entries: entries
      })
    })
  }

  searchTopics(query) {
    let searchQuery = query || this.props.query
    let resourceClient = this.context.resourceClient
    resourceClient.searchTopics(searchQuery, 'russian', (err, topics) => {
      if(err) {
        console.error(err)
        return
      }
      this.extendState({
        foundTopics: topics
      })
    })
  }

  _updateLayout() {
    if (this.props.mobile) {
      document.body.classList.remove('sm-fixed-layout')
      document.body.classList.add('sm-mobile-layout')
    } else {
      document.body.classList.add('sm-fixed-layout')
      document.body.classList.remove('sm-mobile-layout')
    }
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
  _loadData(updatedFilters) {
    let filters = updatedFilters || this.state.filters
    let pagination = this.state.pagination
    let perPage = this.state.perPage
    let options = {
      order: this.state.order,
      limit: perPage,
      offset: pagination ? this.state.items.length : 0
    }
    let items = []

    let documentClient = this.context.documentClient

    documentClient.listDocuments(filters, options, function(err, docs) {
      if (err) {
        console.error('Documents could not be loaded', err)
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

  /*
    Loads fts found fragments
  */
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
          console.error('Search results could not be loaded', err)
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

  _loadTopics(newFilters, search) {
    let resourceClient = this.context.resourceClient
    let filters = newFilters || this.state.filters
    let searchValue = search
    if(isUndefined(search)) searchValue = this.state.search
    let language = 'russian'
    if(searchValue) {
      filters = clone(filters)
      filters.query = searchValue
      filters.language = language
    }

    resourceClient.getTopicsFacets(filters, (err, res) => {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({
        topics: res
      })
    })
  }

  _searchData(value) {
    this.extendState({
      search: value,
      showFilters: false,
      pagination: false,
      resource: false
    })
  }

  /*
    Called when something is changed on subjects model.
    If some of subjects got active, then we will load
    subjects again with new facets.
  */
  _onTopicsChanged(topics) {
    let filters = Object.assign({}, this.state.filters, {topics: topics})
    this.extendState({
      filters: filters,
      pagination: false,
      resource: false,
      documentItems: []
    })
  }

  _applyMetaFilter(id, value, op) {
    let filters = this.state.filters
    let metaFilters = this.state.metaFilters
    let metaFilter = {}
    let prop = 'meta->>' + id
    if(op) prop += op
    metaFilter[prop] = value
    metaFilters[id] = value
    if(op === ' ~~') metaFilter[prop] = '%' + value + '%'
    this.extendState({
      filters: extend({}, filters, metaFilter),
      metaFilters: metaFilters,
      resource: false
    })
  }

  _applyDateRangeFilter(id, value) {
    let range = value.split(',')
    let filters = this.state.filters
    let metaFilters = this.state.metaFilters
    let metaFilter = {}
    let propMin = 'meta->>' + id + ' >='
    let propMax = 'meta->>' + id + ' <='
    metaFilter[propMin] = range[0] + '-01-01'
    metaFilter[propMax] = range[1] + '-12-31'
    metaFilters[id] = value
    this.extendState({
      filters: extend({}, filters, metaFilter),
      metaFilters: metaFilters,
      resource: false
    })
  }

  _resetMetaFilter(id) {
    let filters = clone(this.state.filters)
    let metaFilters = this.state.metaFilters
    let filterKeys = Object.keys(filters)
    let filterKey = findIndex(filterKeys, function(f) { return f.indexOf(id) > -1 })
    let filterKey2 = findLastIndex(filterKeys, function(f) { return f.indexOf(id) > -1 })
    delete metaFilters[id]
    delete filters[filterKeys[filterKey]]
    if(filterKey2) delete filters[filterKeys[filterKey2]]
    this.extendState({
      filters: extend({}, filters),
      metaFilters: metaFilters,
      resource: false
    })
  }

  _resetAllMetaFilters() {
    let filters = clone(this.state.filters)
    let metaFilters = this.state.metaFilters
    let filterKeys = Object.keys(filters)
    each(metaFilters, (filter, id) => {
      let filterKey = findIndex(filterKeys, function(f) { return f.indexOf(id) > -1 })
      let filterKey2 = findLastIndex(filterKeys, function(f) { return f.indexOf(id) > -1 })
      delete metaFilters[id]
      delete filters[filterKeys[filterKey]]
      if(filterKey2) delete filters[filterKeys[filterKey2]]
    })
    this.extendState({
      filters: extend({}, filters),
      metaFilters: metaFilters,
      resource: false
    })
  }

  _showResource(resourceId) {
    this.extendState({
      resource: resourceId
    })
  }

  _setTotal(total) {
    if(this.refs.total) {
      this.refs.total.el.setInnerHTML(
        this.getLabel('total-results') + ': ' + total
      )
    }
  }

  _toggleNavigation() {
    const isActive = this.state.showFilters
    this.extendState({showFilters: !isActive})
  }

  _toggleSearch() {
    const searchbox = this.state.searchbox
    this.extendState({searchbox: !searchbox})
  }
}

export default Explorer
