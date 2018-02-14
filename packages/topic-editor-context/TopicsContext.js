import { Component, ScrollPane } from 'substance'
import { concat, filter, flattenDeep, forEach, map, sortBy } from 'lodash-es'
import TopicSelector from './TopicSelector'

class TopicsContext extends Component {

  constructor(...args) {
    super(...args)

    this.handleActions({
      'showList': this._showList,
      'showEditor': this._showEditor
    })
  }

  didMount() {
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
    let mode = this.props.mode

    if(mode === 'list') {
      return this.renderList($$)
    } else if (mode === 'edit' || mode === 'create') {
      return this.renderTopicSelector($$)
    }
  }

  renderTopicSelector($$) {
    let el = $$('div').addClass('sc-topics-panel')

    el.append(
      $$(TopicSelector, {configurator: this.props.configurator, node: this.props.item})
    )

    return el
  }

  renderList($$) {
    const doc = this.context.doc
    const editorSession = this.context.editorSession
    const topicIndex = doc.getIndex('type').get('topic')
    let activeTopics = []
    forEach(topicIndex, ref => {
      activeTopics = activeTopics.concat(ref.reference)
    })
    let activeNodes = []
    filter(editorSession.topics, topic => {
      if(activeTopics.indexOf(topic.entityId) > -1) activeNodes.push(topic)
    })
    let topicsPanel = $$(ScrollPane).ref('panelEl')

    if(activeNodes) {
      activeNodes.forEach(topic => {
        let item = $$('span').addClass('se-tree-node')
          .attr("href", '#topic=' + topic.entityId)
          .append(topic.name)
          .ref(topic.entityId)
          .on('click', this.highlightNodes.bind(this, topic.entityId))

        if(this.state.selected === topic.entityId) {
          item.addClass('sm-active')
        }

        topicsPanel.append(item)
      })
    }

    let el = $$('div').addClass('sc-context-panel sc-topics-panel').append(
      topicsPanel
    )

    return el
  }

  highlightNodes(activeNode) {
    this.send('showTopics', [activeNode])
    this.setSelected(activeNode)
  }

  setSelected(node) {
    this.extendState({selected: node})
  }

  _showList() {
    this.send('resetBrackets', 'topic')
    this.send('switchContext', {mode: 'list'})
  }

  _showEditor(id) {
    this.send('resetBrackets', 'topic')
    this.send('switchContext', {mode: 'edit', item: id})
  }
}

export default TopicsContext
