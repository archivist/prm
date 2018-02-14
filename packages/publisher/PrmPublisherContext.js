// import { Component } from 'substance'
import { forEach } from 'lodash-es'

import { PublisherContext } from 'archivist-js'

class PrmPublisherContext extends PublisherContext {

  editTopic(node) {
    let mode = 'edit'
    let context = node ? this.contextMap[node.type] : 'topics'
    let state = {
      contextId: context,
      mode: mode,
      item: node ? node.entityId : undefined
    }
    this.extendState(state)
    console.log('Edit container resource', node ? node.entityId : 'new', ',', mode, 'mode')
  }

  getDefaultContext() {
    const role = this._getUserRole()
    if(role !== 'respondent') {
      let configurator = this.props.configurator
      return configurator.getDefaultContext()
    } else {
      return 'comments'
    }
  }

  render($$) {
    const role = this._getUserRole()
    let currentContextName = this.getContextName()
    let TabbedContext = this.getComponent('tabbed-context')

    let el = $$('div').addClass('sc-context-panel sm-role-' + role)
    let tabs = []

    if(role !== 'respondent') {
      forEach(this.contexts, function(context, contextId) {
        tabs.push({id: contextId, name: contextId})
      })
    } else {
      tabs.push({id: 'comments', name: 'comments'})
    }

    el.append(
      $$(TabbedContext, {
        tabs: tabs,
        activeTab: currentContextName
      }).ref('tabbedPane').append(
        this.renderContext($$)
      )
    )

    return el
  }

  _getUserRole() {
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let role = user.role
    return role
  }

}

export default PrmPublisherContext
