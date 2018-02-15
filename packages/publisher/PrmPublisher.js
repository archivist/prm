import { Toolbar } from 'substance'
import { findIndex, forEach, map } from 'lodash-es'
import PrmPublisherContext from './PrmPublisherContext'
import { Publisher } from 'archivist-js'

class PrmPublisher extends Publisher {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'showTopics': this._showTopics,
      'resetBrackets': this._resetBrackets
    })
  }

  didMount() {
    super.didMount()
    let editorSession = this.getEditorSession()
    editorSession.on('createTopicReference', this._createTopicReference, this)
  }

  dispose() {
    super.dispose()
    this.getEditorSession().off(this)
  }

  _renderToolbar($$) {
    const role = this._getUserRole()
    let configurator = this.getConfigurator()
    let Collaborators = this.getComponent('collaborators')
    return $$('div').addClass('se-toolbar-wrapper sm-role-' + role).append(
      $$(Toolbar, {
        toolPanel: configurator.getToolPanel('toolbar')
      }).ref('toolbar'),
      $$(Collaborators)
    )
  }

  _onSessionUpdate(editorSession) {
    let selectionChanged = editorSession.hasChanged('selection')

    if (!editorSession.hasChanged('document') && !selectionChanged) return

    let change = editorSession.getChange()
    if(change) {
      // Rerender brackets if subjects were affected
      change.ops.forEach(op => {
        if(op.path[0].indexOf('subject') > -1) {
          this.refs.brackets.rerender()
          setTimeout(function() {
            this.refs.brackets.updateBrackets()
          }.bind(this))
        }
      })

      // If there is no collaborator data we should add it
      let author = change.info.userId
      if(author) this._addCollaborator(author)
    }

    // TODO: figure out why selection flags changed after comment update
    if(selectionChanged && !this._isCommentChange(change)) {

      let doc = editorSession.getDocument()
      let contextPanel = this.refs.contextPanel

      let schema = doc.getSchema()
      let nodes = schema.nodeRegistry.entries
      let highlights = {}
      forEach(nodes, node => {
        if(node.prototype.isResourceReference) {
          let isResourceReference = node.prototype.isResourceReference()
          if(isResourceReference) {
            highlights[node.type] = []
          }
        }
      })

      let overlapsAnno = false

      let selectionState = editorSession.getSelectionState()
      forEach(highlights, (h, annoType) => {
        let annos = selectionState.getAnnotationsForType(annoType)
        // This will work if inline annotations can't overlap each other
        // we should check for one node
        if(annos.length === 1) {
          let node = annos[0]
          highlights[annoType] = [node.id]
          if(node.reference) {
            let isCollapsed = selectionState.selection.isCollapsed()
            if(isCollapsed) contextPanel.openResource(node)
            overlapsAnno = true
          }
        }
      })

      if(!overlapsAnno) {
        let overlapedComments = selectionState.getAnnotationsForType('comment')
        if(overlapedComments.length > 0) {
          contextPanel.openComment(overlapedComments[0])
        } else {
          let currentContext = contextPanel.state.contextId
          if(currentContext !== 'metadata' && currentContext !== 'file-context') {
            contextPanel.openDefaultTab()
          }
        }
      }

      let contextState = this.refs.contextPanel.getContextState()
      if(contextState.contextId !== 'subjects' || contextState.mode !== 'edit') {
        this._resetBrackets()
      } else {
        highlights['subject'] = this.contentHighlights._highlights.subject
      }

      this.contentHighlights.set(highlights)
    }
  }

  _deleteResource(resourceId) {
    let editorSession = this.getEditorSession()
    let index = findIndex(editorSession.resources, item => { return item.entityId === resourceId })
    let resource = editorSession.resources[index]
    let resourceType = resource.entityType

    editorSession.resources.splice(index, 1)

    if (resourceType === 'subject') {
      editorSession.subjects.delete(resourceId)
      this.refs.contextPanel.rerender()
    }
  }

  _isCommentChange(change) {
    if(change) {
      if(change.ops.length === 1) {
        let path = change.ops[0].path[0]
        if(path.indexOf('comment') > -1) {
          return true
        }
      }
    }

    return false
  }

  _renderContextSection($$) {
    return $$('div').addClass('se-context-section').append(
      $$(PrmPublisherContext, {
        configurator: this.props.configurator
      }).ref('contextPanel')
    )
  }

  _createTopicReference(anno) {
    let contextPanel = this.refs.contextPanel
    contextPanel.editTopic(anno)
  }

  _showTopics(topics) {
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

    setTimeout(function(){
      this.refs.brackets.highlight(topics)
      this.highlightReferences(topics, true)
    }.bind(this), 10)
  }

  _resetBrackets(type) {
    if(type) {
      let highlights = {}
      highlights[type] = []
      this.contentHighlights.set(highlights)
    }
    this.refs.brackets.resetBrackets()
  }

  _getUserRole() {
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let role = user.role
    return role
  }
}

export default PrmPublisher
