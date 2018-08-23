import { FontAwesomeIcon as Icon, ProseEditorPackage } from 'substance'
import { ContainerEditor, Highlights, Layout, SplitPane, TextPropertyEditor } from 'substance'
import { forEach, map, uniq } from 'lodash-es'
import ReaderContext from './ReaderContext'

const { ProseEditor } = ProseEditorPackage

class Reader extends ProseEditor {
  constructor(...args) {
    super(...args)

    let doc = this.editorSession.getDocument()
    this.contentHighlights = new Highlights(doc)

    this.handleActions({
      'showReferences': this._showReferences,
      'showTopics': this._showTopics,
      'referenceHighlight': this._highlightReference
    })
  }

  didMount() {
    let parent = this.getParent()
    let entityId = parent.props.entityId
    if(entityId) {
      setTimeout(() => {
        this.highlightEntity(entityId)
      }, 10)
    }
    if(parent.props.fragment) {
      this.refs.contentPanel.scrollTo(`[data-id="${parent.props.fragment}"]`)
    }
  }

  dispose() {
    this.editorSession.off(this)
    this._dispose()
  }

  render($$) {
    let el = $$('div').addClass('sc-reader')

    if(!this.props.mobile) {
      el.append(
        $$(SplitPane, {splitType: 'vertical', sizeB: '30%'}).append(
          this._renderMainSection($$),
          this._renderContextSection($$)
        )
      )
    } else {
      el.append(
        this._renderNavigationPanel($$),
        this._renderMainSection($$),
        this._renderContextSection($$)
      )
    }
    return el
  }

  _renderNavigationPanel($$) {
    let el = $$('div').addClass('se-mobile-header')

    el.append(
      $$('div').addClass('se-navigation-toggle').append(
        $$(Icon, {icon: 'fa-comments'})
      ).ref('headerToggle').on('click', this._toggleNavigation)
    )

    return el
  }

  _renderContextSection($$) {
    let parent = this.getParent()
    return $$('div').addClass('se-context-section').append(
      $$(ReaderContext, parent.props).ref('contextPanel')
    ).ref('contextSection')
  }

  _renderMainSection($$) {
    let mainSection = $$('div').addClass('se-main-section sm-active').ref('mainSection')
    mainSection.append(this._renderContentPanel($$))
    return mainSection
  }

  _renderContentPanel($$) {
    const doc = this.props.editorSession.getDocument()
    const configurator = this.props.configurator

    let ScrollPane = this.componentRegistry.get('scroll-pane')
    let Overlay = this.componentRegistry.get('overlay')
    let Brackets = this.componentRegistry.get('brackets')

    let contentPanel = $$(ScrollPane, {
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      highlights: this.contentHighlights
    }).ref('contentPanel')

    let layout = $$(Layout, {
      width: 'large'
    })

    layout.append(
      $$(Brackets).ref('brackets'),
      $$(TextPropertyEditor, {
        name: 'abstract',
        path: ["meta", "abstract"],
        disabled: true
      }).addClass('se-abstract'),
      $$(ContainerEditor, {
        disabled: true,
        editorSession: this.editorSession,
        node: doc.get('body'),
        commands: configurator.getSurfaceCommandNames()
      }).ref('body'),
      $$(Overlay, {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: 'dark'
      })
    )

    contentPanel.append(layout)
    return contentPanel
  }

  highlightEntity(entityId) {
    const entity = this._getEntityEntry(entityId)
    const isContainerReference = entity.entityType === 'topic'
    if(isContainerReference) {
      this._showTopics([entityId], true)
    } else {
      this._showReferences([entityId], true)
    }
  }

  highlightReferences(entities, containerAnnos) {
    let editorSession = this.editorSession
    let doc = editorSession.getDocument()
    let entityIndex = doc.getIndex('entities')
    let schema = doc.getSchema()
    let nodes = schema.nodeRegistry.entries
    let highlights = {}
    forEach(nodes, node => {
      if(node.schema.hasOwnProperty('reference')) {
        highlights[node.type] = []
      }
    })
    forEach(entities, entityId => {
      if(containerAnnos) {
        let refs = entityIndex.get(entityId)
        forEach(refs, ref => {
          let entityType = ref.type
          highlights[entityType] = highlights[entityType].concat(ref.id + '-bracket')
          highlights[entityType] = uniq(highlights[entityType])
        })
      } else {
        let refs = entityIndex.get(entityId)
        let keys = Object.keys(refs)
        if(keys.length > 0) {
          let entityType = refs[keys[0]].type
          let annos = map(refs, n => {return n.id})
          highlights[entityType] = highlights[entityType].concat(annos)
        }
      }
    })

    if(this.props.mobile) {
      this._toggleNavigation()
    }

    this.contentHighlights.set(highlights)
  }

  _showReferences(entityId, silent) {
    let container = this.refs.body.getContainer()
    let editorSession = this.editorSession
    let doc = editorSession.getDocument()
    let entityIndex = doc.getIndex('entities')
    let refs = entityIndex.get(entityId)
    // We are sorting references by paregraph position
    // if nodes annotations are in same paragraph
    // we will sort them by start offset
    let refIds = Object.keys(refs)
    let ordered = refIds.sort((a,b) => {
      const refAPath = refs[a].getPath()
      const refBPath = refs[b].getPath()

      if (refAPath[0] !== refBPath[0]){
        return (container.getPosition(refAPath[0]) - container.getPosition(refBPath[0]))
      } else {
        const refAOffset = refs[a].start.getOffset()
        const refBOffset = refs[b].start.getOffset()

        return (refAOffset - refBOffset)
      }
    })

    this.refs.contentPanel.scrollTo(`[data-id="${ordered[0]}"]`)
    this.highlightReferences([entityId])

    if(!silent) {
      let urlHelper = this.context.urlHelper
      urlHelper.focusResource(entityId)
    }
  }

  _showTopics(topics, silent) {
    let editorSession = this.editorSession
    let doc = editorSession.getDocument()
    let entityIndex = doc.getIndex('entities')
    let paragraphs = []
    forEach(topics, topic => {
      let refs = entityIndex.get(topic)
      let paras = map(refs, n => {return n.start.path[0]})
      paragraphs = paragraphs.concat(paras)
    })
    let firstPara = doc.getFirst(paragraphs)
    this.refs.contentPanel.scrollTo(`[data-id="${firstPara}"]`)

    if(!silent) {
      let urlHelper = this.context.urlHelper
      urlHelper.focusResource(topics)
    }

    setTimeout(function(){
      this.refs.brackets.highlight(topics)
      this.highlightReferences(topics, true)
    }.bind(this), 10)
  }

  _highlightReference() {
    if(this.props.mobile) {
      this._toggleNavigation()
    }
  }

  _toggleNavigation() {
    const contextOpen = this.refs.contextSection.hasClass('sm-active')
    if(contextOpen) {
      this.refs.mainSection.addClass('sm-active')
      this.refs.contextSection.removeClass('sm-active')
      this.refs.headerToggle.removeClass('sm-active')
    } else {
      this.refs.contextSection.addClass('sm-active')
      this.refs.mainSection.removeClass('sm-active')
      this.refs.headerToggle.addClass('sm-active')
    }
  }

  _getEntityEntry(entityId) {
    let editorSession = this.editorSession
    let resources = editorSession.resources

    return resources.find(r => {
      return r.entityId === entityId
    })
  }
}

export default Reader
