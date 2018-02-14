import { Component } from 'substance'
import { clone, concat, flattenDeep, isEmpty, map, sortBy } from 'lodash-es'

class TopicSelector extends Component {

  getInitialState() {
    const doc = this.context.doc
    const nodeId = this.props.node
    let topics = []
    if(nodeId !== undefined) {
      topics = doc.get(nodeId).reference
    }
    return {
      topics: topics
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-topic-selector')
    let ScrollPane = this.getComponent('scroll-pane')

    let header = $$('div').addClass('sc-panel-header').append(
      $$('div').addClass('sc-goback-action').append(
        this.context.iconProvider.renderIcon($$, 'goBackToList'),
        this.getLabel('goBackToTopics')
      ).on('click', this._goBack),
      $$('div').addClass('sc-actions').append(
        $$('div').addClass('sc-remove-action').append(
          this.context.iconProvider.renderIcon($$, 'removeReference'),
          this.getLabel('removeReference')
        ).on('click', this._removeAnno)
      )
    )

    el.append(
      header,
      $$(ScrollPane).addClass('se-topic-tree').append(
        this.renderList($$)
      ).ref('topicTree')
    )

    return el
  }

  renderList($$) {
    let editorSession = this.context.editorSession
    let topics = editorSession.topics

    let nodeTopics = this.state.topics

    let topicsPanel = $$('div').addClass('se-topics-entries')

    if(topics) {
      topics.forEach(topic => {
        const isSelected = nodeTopics.indexOf(topic.entityId) > -1
        const selectedIcon = isSelected ? 'checked' : 'unchecked'
        let item = $$('div').addClass('se-entity-entry').ref(topic.entityId)
        if(isSelected) item.addClass('sm-selected')
        item.append(
          this.renderIcon($$, selectedIcon).addClass('selection'),
          $$('span').addClass('se-tree-node-name').append(topic.name)
        ).on('click', this._toggleItem.bind(this, topic.entityId))

        topicsPanel.append(item)
      })
    }

    return topicsPanel
  }

  renderIcon($$, icon) {
    let iconEl = this.context.iconProvider.renderIcon($$, icon)
    return iconEl
  }

  _toggleItem(id, e) {
    e.preventDefault()
    e.stopPropagation()
    const nodeId = this.props.node
    let topics = this.state.topics
    const topicIndex = topics.indexOf(id)
    if(topicIndex > -1) {
      topics.splice(topicIndex, 1)
      this.extendState({topics: topics})
    } else {
      this.extendState({topics: topics.concat(id)})
    }

    if(nodeId) {
      this._setReference()
    } else {
      this._createReference()
    }
  }

  _setReference() {
    const nodeId = this.props.node
    const topics = this.state.topics
    const editorSession = this.context.editorSession
    editorSession.transaction((tx) => {
      tx.set([nodeId, 'reference'], topics)
    })
  }

  _createReference() {
    const topics = this.state.topics
    const editorSession = this.context.editorSession
    let annoData = {
      type: 'topic',
      reference: topics
    }
    let anno
    editorSession.transaction((tx, args) => {
      anno = tx.annotate(annoData)
      return args
    })
    this.send('showEditor', anno.id)
    // this.extendProps({
    //   node: anno.id,
    //   mode: 'edit'
    // })
  }

  _goBack() {
    this.send('showList')
  }

  _removeAnno() {
    let nodeId = this.props.node
    let editorSession = this.context.editorSession
    editorSession.transaction(function(tx, args) {
      tx.delete(nodeId)
      return args
    })
    this.send('showList')
  }
}

export default TopicSelector
