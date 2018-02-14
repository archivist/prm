import { Component, SplitPane } from 'substance'
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
      'applyMetaFilter': this._applyMetaFilter,
      'applyDateRangeFilter': this._applyDateRangeFilter,
      'resetMetaFilter': this._resetMetaFilter,
      'resetAllMetaFilters': this._resetAllMetaFilters
    })
  }

  didMount() {
    this._loadData()
    this._loadTopics()
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
    return {
      filters: {"meta->>'state'": "published", topics: []},
      metaFilters: {},
      search: '',
      resource: this.props.resourceId,
      perPage: 30,
      order: "meta->>'published_on' desc, \"documentId\" desc",
      pagination: false,
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

    let SearchBar = this.getComponent('searchbar')

    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left'
    }).addClass('se-explorer-layout')

    layout.append(
      $$(SearchBar, {value: this.state.search}),
      $$(SplitPane, {splitType: 'vertical', sizeB: '30%'}).addClass('se-results-pane').append(
        this.renderMainSection($$),
        this.renderSidebarSection($$)
      )
    )

    el.append(layout)

    return el
  }

  renderMainSection($$) {
    let documentItems = this.state.items
    if (documentItems.length > 0) {
      return this.renderFull($$)
    } else {
      return this.renderEmpty($$)
    }
  }

  renderSidebarSection($$) {
    let el = $$('div').addClass('se-sidebar')
    let ResourceEntries = this.getComponent('resource-entries')
    let TopicEntries = this.getComponent('topic-entries')
    let MetaFilters = this.getComponent('meta-filters')
    let Facets = this.getComponent('facets')

    if(this.state.total) {
      el.append(
        $$('div').addClass('se-total').append(
          this.getLabel('total-results') + ': ' + this.state.total
        ).ref('total')
      )
    }

    if(this.state.search) {
      if(!isEmpty(this.state.foundTopics)) el.append($$(TopicEntries, {entries: this.state.foundTopics}))
      if(!isEmpty(this.state.entries)) el.append($$(ResourceEntries, {entries: this.state.entries}))
    }

    el.append(
      $$(Facets, {topics: this.state.topics}).ref('facets'),
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
    let resource = this.state.resource
    let DocumentItem = this.getComponent('document-item')
    let Pager = this.getComponent('pager')
    let ResourceReference = this.getComponent('resource-reference')
    let grid = $$(Grid)

    if(resource) {
      return $$(ResourceReference, {resource: resource})
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
    let mainConfigurator = this.context.configurator
    let configurator = mainConfigurator.getConfigurator('archivist-subjects')
    let filters = newFilters || this.state.filters
    let facets = filters.topics
    let searchValue = search
    if(isUndefined(search)) searchValue = this.state.search
    let language = 'russian'
    if(searchValue) {
      filters = clone(filters)
      filters.query = searchValue
      filters.language = language
    }

    resourceClient.getSubjectsFacets(filters, (err, res) => {
      if (err) {
        console.error('ERROR', err)
        return
      }

      let importer = configurator.createImporter('subjects')
      let topics = importer.importDocument(res, true, facets)
      topics.on('document:changed', this._onTopicsChanged, this)

      this.extendState({
        topics: topics
      })
    })
  }

  _searchData(value) {
    this.extendState({
      search: value,
      pagination: false,
      resource: false
    })
  }

  /*
    Called when something is changed on subjects model.
    If some of subjects got active, then we will load
    subjects again with new facets.
  */
  _onTopicsChanged(change) {
    let facetChange = false
    each(change.updated, function(val, key){
      if(key.indexOf('active') > -1) {
        facetChange = true
      }
    })

    if(facetChange) this._applyFacets()
  }

  /*
    Called when facets changed.
    Will change filters and load new subjects facets again.
  */
  _applyFacets() {
    let topics = this.state.topics
    let filters = this.state.filters
    let facets = topics.getActive()
    topics.off(this)

    this.extendState({
      filters: extend({}, filters, {topics: facets}),
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
    this.refs.total.el.setInnerHTML(
      this.getLabel('total-results') + ': ' + total
    )
  }
}

export default Explorer
