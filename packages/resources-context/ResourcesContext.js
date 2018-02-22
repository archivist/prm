import { Component } from 'substance'
import { filter, find, forEach, orderBy } from 'lodash-es'

class ResourcesContext extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'switchActive': this._switchActive
    })
  }

  didMount() {
    if(this.props.entityId) {
      this.focusResource(this.props.entityId)
    }
  }

  willReceiveProps(newProps) {
    if(newProps.entityId !== this.props.entityId && newProps.entityId !== undefined) {
      this.focusResource(newProps.entityId)
    }
  }

  didUpdate() {
    if(this.state.entityId && !this.state.noScroll) {
      this.refs.panelEl.scrollTo(`[data-id="${this.state.entityId}"]`)
    }
  }

  getEntry(entityId) {
    let editorSession = this.context.editorSession
    let resources = editorSession.resources

    return find(resources, function(r) {
      return r.entityId === entityId
    })
  }

  getEntries(entityType) {
    let editorSession = this.context.editorSession
    let resources = editorSession.resources
    let entries = filter(resources, {entityType: entityType})
    let orderedEntries = orderBy(entries, 'name', 'asc');

    return orderedEntries
  }

  getEntityRender(entityType) {
    let configurator = this.props.configurator
    return configurator.getContextItem(entityType)
  }

  renderEntityContext($$, resourceType) {
    let entityId = this.state.entityId

    let entityEntries = $$("div")
      .addClass("se-entity-entries")

    let entries = this.getEntries(resourceType)

    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i]

      let EntityComp = this.getEntityRender(entry.entityType)
      let item = $$(EntityComp, entry).ref(entry.entityId)

      if(entry.entityId === entityId) {
        item.addClass('se-active')
      }

      entityEntries.append(item)
    }

    return entityEntries
  }

  renderTopics($$) {
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
    let topicsPanel = $$('div').addClass('se-topic-entries')

    if(activeNodes) {
      activeNodes.forEach(topic => {
        let item = $$('div').addClass('se-tree-node')
          .attr("data-id", topic.entityId)
          .append(topic.name)
          .ref(topic.entityId)
          .on('click', this.highlightTopicNodes.bind(this, topic.entityId))

        if(this.state.entityId === topic.entityId) {
          item.addClass('sm-active')
        }

        topicsPanel.append(item)
      })
    }

    return topicsPanel
  }

  render($$) {
    let configurator = this.props.configurator
    let contexts = configurator.getResourceTypes()
    let ScrollPane = this.getComponent('scroll-pane')
    let entityPanel = $$('div').addClass('sc-entity-panel').append(
      $$('div').addClass('se-title').append(this.getLabel('topic-resources')),
      this.renderTopics($$)
    )

    contexts.forEach(context => {
      entityPanel.append(
        $$('div').addClass('se-title').append(this.getLabel(context.name)),
        this.renderEntityContext($$, context.id)
      )
    })

    return $$('div').addClass('sc-context-panel').append(
      $$(ScrollPane).ref('panelEl').append(
        entityPanel
      )
    )
  }

  focusResource(entityId) {
    let resource = this.getEntry(entityId)

    if(resource) {
      this.setState({
        contextId: resource.entityType,
        entityId: entityId
      })
    }
  }

  highlightTopicNodes(activeNode) {
    this.send('showTopics', [activeNode])
    this._switchActive('topic', activeNode)
  }

  _switchActive(entityType, entityId) {
    this.setState({
      contextId: entityType,
      entityId: entityId,
      noScroll: true
    })
  }
}

export default ResourcesContext
