import { Component, ScrollPane } from 'substance'
import { concat, filter, flattenDeep, map, sortBy } from 'lodash-es'

class SubjectsContext extends Component {
  
  didMount() {
    this.buildTree()
    if(this.props.topic) {
      this.highlightNodes(this.props.topic)
    }
  }

  willReceiveProps(newProps) {
    if(newProps.topic !== this.props.topic && newProps.topic !== undefined) {
      this.highlightNodes(newProps.topic)
    }
  }

  render($$) {
    let subjects = this.state.subjects
    let subjectsPanel = $$(ScrollPane).ref('panelEl')
    let el = $$('div').addClass('sc-context-panel sc-subjects-panel').append(
      subjectsPanel
    )
    if(subjects) {
      let childNodes = subjects.getRoots()
      childNodes = sortBy(childNodes, ['position'])

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))

      subjectsPanel.append(flattenDeep(childEls))
    }

    return el
  }

  buildTree() {
    let editorSession = this.context.editorSession
    let subjectsTree = editorSession.subjects
    let resources = editorSession.resources
    let subjects = filter(resources, {entityType: 'subject'})
    subjects.forEach(s => {
      subjectsTree.set([s.entityId, 'active'], true)
      let parents = subjectsTree.getParents(s.entityId)
      parents.forEach(pid => {
        subjectsTree.set([pid, 'active'], true)
      })
    })
    this.extendState({
      subjects: subjectsTree
    })
  }

  highlightNodes(activeNode) {
    let subjects = this.state.subjects
    subjects.resetSelection()
    let activeNodes = subjects.getAllChildren(activeNode)
    activeNodes.unshift(activeNode)
    this.send('showTopics', activeNodes)
  }

  renderChildren($$, node, level) {
    let editorSession = this.context.editorSession
    let subjects = editorSession.subjects
    let isActive = node.active
    let childNodes = subjects.getChildren(node.id)
    childNodes = sortBy(childNodes, ['position'])
    let childrenEls = []

    if(isActive) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    
      let el = $$('a').addClass('se-tree-node se-level-' + level)
      .attr("href", '#topic=' + node.id)
      .append(node.name)
      .ref(node.id)

      if(node.id === this.props.topic) {
        el.addClass('sm-active')
      }

      return concat(el, childrenEls);
    } else {
      return []
    }
  }
}

export default SubjectsContext
