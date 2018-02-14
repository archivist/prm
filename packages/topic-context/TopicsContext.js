import { Component, ScrollPane } from 'substance'
import { concat, filter, flattenDeep, forEach, map, sortBy } from 'lodash-es'

class TopicsContext extends Component {

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
    const doc = this.context.doc
    const editorSession = this.context.editorSession
    const resources = editorSession.resources
    const topics = filter(resources, {entityType: 'topic'})

    const topicIndex = doc.getIndex('type').get('topic')
    let activeTopics = []
    forEach(topicIndex, ref => {
      activeTopics = activeTopics.concat(ref.reference)
    })
    let activeNodes = []
    filter(topics, topic => {
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
}

export default TopicsContext
