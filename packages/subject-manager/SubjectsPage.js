import { Component, FontAwesomeIcon as Icon, SplitPane, SubstanceError as Err } from 'substance'
import { concat, each, flattenDeep, isEmpty, sortBy, map, throttle} from 'lodash-es'
import moment from 'moment'

class SubjectsPage extends Component {
  constructor(...args) {
    super(...args)

    this.dragSource = null
    this.currentTarget = null
    this.updateStack = []
    this.handleActions({
      'newSubject': this._newSubject,
      'toggleDescription': this._toggleDescription,
      //'closeModal': this._doneEditing,
      'finishEditing': this._doneEditing,
      'closeResourceOperator': this._doneEditing,
      'updateEntity': this._updateEntity,
      'deleteEntity': this._removeFromList
    })
  }

  get pageName() {
    return this.constructor.pageName
  }

  getInitialState() {
    return {
      description: true,
      active: {},
      filters: {entityType: 'subject'},
      search: '',
      perPage: 1000,
      order: 'cast(data->>\'position\' as integer)',
      direction: 'asc',
      pagination: false,
      items: {}
    }
  }

  didMount() {
    document.title = this.getLabel(this.pageName)
    this._loadData()
  }

  render($$) {
    const Modal = this.getComponent('modal')

    let items = this.state.items
    let el = $$('div').addClass('sc-subjects-page')
    let main = $$('div').addClass('se-entity-layout')

    let header = this.renderHeader($$)

    let toolbox = this.renderToolbox($$)
    main.append(toolbox)

    if (this.state.entityId && this.state.mode === 'edit') {
      let EntityEditor = this.getComponent('entity-editor')

      main.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EntityEditor, {entityId: this.state.entityId})
        ).ref('modal')
      )
    }

    if(this.state.entityId && (this.state.mode === 'delete' || (this.state.mode === 'merge' && this.state.mergeEntityId))) {
      let ResourceOperator = this.getComponent('resource-operator')

      main.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(ResourceOperator, {
            entityId: this.state.entityId,
            mergeEntityId: this.state.mergeEntityId,
            item: items.get(this.state.entityId),
            mergeItem: items.get(this.state.mergeEntityId),
            mode: this.state.mode
          })
        ).ref('modal')
      )
    }

    if (!isEmpty(items)) {
      main.append(this.renderFull($$))
    } else {
      main.append(this.renderEmpty($$))
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

    return filters
  }

  renderHeader($$) {
    let Menu = this.getComponent('menu')
    return $$(Menu, {page: this.pageName})
  }

  renderToolbox($$) {
    let Toolbox = this.getComponent('toolbox')
    let filters = this.renderFilters($$)

    let toolbox = $$(Toolbox, {
      actions: {
        'toggleDescription': this.getLabel('toggle-description'),
        'newSubject': this.getLabel('add-subject')
      },
      content: filters
    })

    return toolbox
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
        $$('p').html('Sorry, no subjects matches your query')
      )
    } else {
      let Spinner = this.getComponent('spinner')

      layout.append(
        $$(Spinner, {message: 'spinner-loading'})
      )
    }

    return layout
  }

  renderEntityIcon($$) {
    return $$(Icon, {icon: 'fa-users'})
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
    const Grid = this.getComponent('grid')

    let items = this.state.items
    let grid = $$(Grid)

    if(items) {
      let childNodes = items.getRoots()
      childNodes = sortBy(childNodes, ['position'])

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))

      grid.append(flattenDeep(childEls))
    }

    return grid
  }

  renderChildren($$, node, level) {
    const Grid = this.getComponent('grid')

    let items = this.state.items
    let updatedFromNow = moment(node.edited).fromNow()
    let updatedDateTime = moment(node.edited).format('DD.MM.YYYY HH:mm')
    let edited = this.getLabel('updated-info')
      .replace('fromnow', updatedFromNow)
      .replace('datetime', updatedDateTime)
      .replace('username', node.updatedBy)
    let isHighlighted = node.selected
    let isExpanded = node.expanded || items.hasSelectedChildren(node.id)
    let childNodes = items.getChildren(node.id)
    childNodes = sortBy(childNodes, ['position'])
    let hideExpand = isEmpty(childNodes)
    let childrenEls = []

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    }

    let title = $$(Grid.Cell, {columns: 6}).addClass('se-title')
    title.addClass('se-level-' + level)
    if(!hideExpand) {
      let expandedIcon = isExpanded ? 'expanded' : 'collapsed'
      title.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('se-collapse')
      )
    }
    title.append($$('span').addClass('se-tree-node-name').append(node.name))

    let additionalActions = [
      {label: this.getLabel('edit-action'), action: this._editItem.bind(this, node.id)},
      {label: this.getLabel('add-subject-action'), action: this._newSubject.bind(this, node.id)},
      {label: this.getLabel('show-documents-action'), action: this._loadReferences.bind(this, node.id)}
    ]

    if(hideExpand) {
      additionalActions.push(
        {label: this.getLabel('delete-action'), action: this._removeItem.bind(this, node.id)},
        {label: this.getLabel('merge-action'), action: this._merge.bind(this, node.id)}
      )
    }

    if(this.state.mode === 'merge') {
      additionalActions.push({label: 'Merge into', action: this._mergeInto.bind(this, node.id)})
    }

    let el = $$('div').addClass('se-row se-tree-node').append(
      title,
      $$(Grid.Cell, {columns: 3}).append(edited),
      $$(Grid.Cell, {columns: 2}).append(node.count ? this.getLabel('document-counter').replace('count', node.count) : this.getLabel('document-counter').replace('count', 0)),
      $$(Grid.Cell, {columns: 1}).addClass('se-additional').append(
        this.renderAdditionalMenu($$, additionalActions)
      ).on('click', function(e) {
        e.stopPropagation()
      })
    )
    .ref(node.id)
    .on('click', this._expandNode.bind(this, node.id))
    .attr({draggable: true})
    .on('dragstart', this._onDragStart.bind(this, node.id))
    .on('dragend', this._onDragEnd)
    .on('dragover', throttle(this._onDragOver.bind(this, node.id), 300))

    if(isHighlighted) {
      el.addClass('se-highlighted')
    }

    if(node.description && this.state.description) {
      el.append(
        $$(Grid.Row).addClass('se-tree-node-description').append(
          $$('div').addClass('se-cell se-description').addClass('se-level-' + level).setInnerHTML(node.description)
        )
      )
    }

    let details = this.state.details
    let references = this.state.references
    let refs = []

    if(details === node.id && references) {
      references.forEach((reference) => {
        let referenceIcon = $$(Icon, {icon: 'fa-file-text-o'})
        refs.push(
          $$(Grid.Row).addClass('se-document-reference').ref(reference.documentId).append(
            $$(Grid.Cell, {columns: 2}).addClass('se-badge se-level-' + level).append(referenceIcon),
            $$(Grid.Cell, {columns: 10}).addClass('se-reference').append(reference.title)
          )
        )
      })
    }

    return concat(el, refs, childrenEls)
  }

  _expandNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let items = this.state.items
    let isExpanded = items.get([id, 'expanded'])
    items.set([id, 'expanded'], !isExpanded)
    this.extendProps({
      items: items
    })
  }

  _onDragStart(id, e) {
    this._initDrag(id, e)
  }

  _onDragEnd() {
    if(this.currentState === 'after' || this.currentState === 'before' ) {
      this._moveItem(this.dragSource, this.currentTarget, this.currentState)
    }
    this.dragSource = null
    this.currentTarget = null
    this.currentDrillTarget = null
    this.currentState = null
  }

  _onDragOver(id, e) {
    this.currentTarget = id
    let dropTarget = this.refs[id].getNativeElement()
    let activeEls = dropTarget.parentElement.querySelectorAll('.se-drop-before, .se-drop-after, .se-drop-drill')
    for (let i = activeEls.length - 1; i >= 0; i--) {
      activeEls[i].classList.remove('se-drop-before', 'se-drop-after', 'se-drop-drill')
    }
    let elHeight = dropTarget.offsetHeight
    let hasChildren = this.state.items.hasChildren(id)
    let after = hasChildren ? e.offsetY > elHeight/4*3 : e.offsetY >= elHeight/2
    let before = hasChildren ? e.offsetY < elHeight/4 : e.offsetY < elHeight/2
    if(after) {
      dropTarget.classList.add('se-drop-after')
      this.currentState = 'after'
    } else if (before) {
      dropTarget.classList.add('se-drop-before')
      this.currentState = 'before'
    } else if (hasChildren) {
      dropTarget.classList.add('se-drop-drill')
      if(this.currentDrillTarget !== id && this.dragSource !== id) {
        this.currentState = 'drill'
        this.currentDrillTarget = id
        if(this.currentTarget === id && this.currentState === 'drill') {
          this._expandNode(id, e)
        }
      }
    }
  }

  _initDrag(id) {
    this.dragSource = id
    this.currentTarget = id
  }

  _moveItem(source, target, pos) {
    if(source === target) return

    let items = this.state.items
    console.info('moving', source, pos, target)
    console.info('moving', items.get([source, 'name']), pos, items.get([target, 'name']))

    let sourcePos = items.get([source, 'position'])
    let sourceParent = items.get([source, 'parent'])
    let dropPos = items.get([target, 'position'])
    let targetPos = pos === 'before' ? dropPos : dropPos + 1
    let targetParent = items.get([target, 'parent'])

    if(sourceParent === targetParent) {
      if(sourcePos === targetPos) return
      if(sourcePos - targetPos === 1 && pos === 'after') return
      if(sourcePos - targetPos === -1 && pos === 'before') return
    }

    if(sourceParent === targetParent && sourcePos > targetPos) {
      this._fixSourceLeaf(items, sourcePos, sourceParent)
    }

    let targetSiblings = targetParent !== null ? items.getChildren(targetParent) : items.getRoots()
    each(targetSiblings, node => {
      if(node.position >= targetPos) {
        items.set([node.id, 'position'], node.position + 1)
        this.updateStack.push(node.id)
      }
    })
    console.info('new position', targetPos)
    items.set([source, 'position'], targetPos)
    items.set([source, 'parent'], targetParent)
    this.updateStack.push(source)

    if(sourceParent !== targetParent || sourcePos <= targetPos) {
      this._fixSourceLeaf(items, sourcePos, sourceParent)
    }

    // debugging
    let tSiblings = targetParent !== null ? items.getChildren(targetParent) : items.getRoots()
    let tPositions = []
    each(tSiblings, n => {
      tPositions.push(n.position)
    })

    console.info('target positions', tPositions)
    let sSiblings = sourceParent !== null ? items.getChildren(sourceParent) : items.getRoots()
    let sPositions = []
    each(sSiblings, n => {
      sPositions.push(n.position)
    })
    console.info('source positions', sPositions)

    this.extendProps({
      items: items
    })

    this._performUpdate()
  }

  _fixSourceLeaf(items, sourcePos, sourceParent) {
    let sourceSiblings = sourceParent !== null ? items.getChildren(sourceParent) : items.getRoots()
    each(sourceSiblings, node => {
      if(node.position >= sourcePos) {
        items.set([node.id, 'position'], node.position - 1)
        this.updateStack.push(node.id)
      }
    })
  }

  _editItem(id) {
    this.extendState({
      entityId: id,
      mode: 'edit'
    })
  }

  _removeItem(id) {
    this.extendState({
      entityId: id,
      mode: 'delete'
    })
  }

  _mergeInto(id) {
    this.extendState({
      mergeEntityId: id,
      mode: 'merge'
    })
  }

  _merge(id) {
    this.extendState({
      entityId: id,
      mode: 'merge'
    })
  }

  /*
    Create a new subject
  */
  _newSubject(parentId) {
    parentId = typeof parentId === 'string' || parentId instanceof String ? parentId : 'root'
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let resourceClient = this.context.resourceClient
    let items = this.state.items
    let entityData = {
      name: this.getLabel('subject-default-name'),
      synonyms: [],
      description: '',
      entityType: 'subject',
      userId: user.userId,
      updatedBy: user.userId,
      data: {
        name: this.getLabel('subject-default-name'),
        workname: '',
        parent: parentId,
        position: Object.keys(items.getRoots()).length,
        description: ''
      }
    }
    resourceClient.createEntity(entityData, (err, entity) => {
      if (err) {
        this.setState({
          error: new Err('EntitiesPage.CreateError', {
            message: 'Entity could not be created.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      items.create({
        id: entity.entityId,
        type: 'subject',
        name: entity.data.name,
        workname: entity.data.workname,
        position: entity.data.position,
        count: 0,
        edited: entity.edited,
        updatedBy: entity.updatedBy,
        description: entity.data.description,
        parent: parentId
      })

      this.extendProps({
        items: items
      })
    })
  }

  /*
    Loads entities
  */
  _loadData() {
    let resourceClient = this.context.resourceClient
    let mainConfigurator = this.context.configurator
    let configurator = mainConfigurator.getConfigurator('archivist-subjects')
    let filters = this.state.filters
    let perPage = this.state.perPage
    let order = this.state.order
    let direction = this.state.direction
    let pagination = this.state.pagination
    let options = {
      mode: 'full',
      limit: perPage,
      offset: pagination ? this.state.items.length : 0,
      order: order + ' ' + direction
    }

    resourceClient.listEntities(filters, options, (err, res) => {
      if (err) {
        this.setState({
          error: new Err('EntitiesPage.LoadingError', {
            message: 'Entities could not be loaded.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      let importer = configurator.createImporter('subjects')
      let subjects = importer.importDocument(res.records)

      this.extendState({
        items: subjects
      })
    })
  }

  _loadReferences(entityId) {
    let filters = {}
    let options = {
      columns: ['"documentId"', 'title'],
      order: '"updatedAt" DESC'
    }
    let documentClient = this.context.documentClient

    if(entityId) {
      documentClient.getReferences(entityId, filters, options, function(err, references) {
        if (err) {
          this.setState({
            error: new Err('EntitiesPage.GetReferencesError', {
              message: 'Search results could not be loaded.',
              cause: err
            })
          })
          console.error('ERROR', err)
          return
        }

        this.extendState({
          details: entityId,
          references: references.records
        })
      }.bind(this))
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
    let tree = this.state.items

    tree.resetSelection()

    if(searchValue !== '') {
      let nodes = tree.getNodes()

      each(nodes, (node) => {
        let name = node.name.toLowerCase()
        if(name.indexOf(searchValue.toLowerCase()) > -1) {
          tree.set([node.id, 'selected'], true)
        }
      })
    }

    this.extendState({
      search: searchValue,
      items: tree
    })
  }

  isSearchEventSupported() {
    let element = document.createElement('input')
    let eventName = 'onsearch'
    let isSupported = (eventName in element)

    return isSupported
  }

  /*
    Close modal
  */
  _doneEditing() {
    // TODO: form editor isn't disposing, we shouldn't do it manually
    this.refs.modal.triggerDispose()
    this.extendState({entityId: undefined, mergeEntityId: undefined, mode: undefined})
  }

  // /*
  //   Close Resource Operator modal
  // */
  // _closeResourceOperator() {
  //   this.extendState({entityId: undefined, mode: undefined})
  // }

  /*
    Update grid data
  */
  _updateEntity(entity) {
    let items = this.state.items
    items.set([entity.entityId, 'name'], entity.name)
    items.set([entity.entityId, 'description'], entity.description)
  }

  _removeFromList(id) {
    let items = this.state.items
    let item = items.get(id)
    items.delete(id)
    this._fixSourceLeaf(items, item.position, item.parent)
    this.extendState({items: items, entityId: undefined, mergeEntityId: undefined, mode: undefined})
    this._performUpdate()
  }

  _toggleDescription() {
    let currentState = this.state.description
    this.extendState({description: !currentState})
  }

  _performUpdate() {
    let resourceClient = this.context.resourceClient
    let items = this.state.items
    let updated = []

    each(this.updateStack, (id) => {
      let item = items.get(id).toJSON()
      let record = {
        entityId: item.id,
        name: item.name,
        description: item.description,
        data: {
          name: item.name,
          parent: item.parent,
          position: item.position,
          workname: item.workname,
          description: item.description
        }
      }
      updated.push(record)
    })

    resourceClient.updateEntities(updated, (err) => {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.updateStack = []
    })
  }
}

SubjectsPage.pageName = 'subjects'

export default SubjectsPage
