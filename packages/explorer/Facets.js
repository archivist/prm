import { Component } from 'substance'
import { concat, flattenDeep, isEmpty, map } from 'lodash-es'

class Facets extends Component {

  render($$) {
    let topics = this.props.topics
    let el = $$('div').addClass('sc-facets')

    if(!isEmpty(topics)) {
      let childNodes = topics.getRoots()
      if(isEmpty(childNodes)) return el
      childNodes = map(childNodes, item => {
        return item
      })

      el.addClass('se-panel').append(
        $$('div').addClass('se-tree-node se-title').append(this.getLabel('topic-facets'))
      )

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))
      
      el.append(flattenDeep(childEls))
    }

    return el
  }

  renderChildren($$, node, level) {
    let topics = this.props.topics
    let isSelected = node.active
    let hasSelectedChildren = topics.hasActiveChildren(node.id)
    let isExpanded = node.expanded || isSelected || hasSelectedChildren
    let childNodes = topics.getChildren(node.id)
    let hideExpand = isEmpty(childNodes)
    let childrenEls = []

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    }

    let el = $$('div').addClass('se-tree-node').ref(node.id)
      .on('click', this._expandNode.bind(this, node.id))
      
    if(isSelected) el.addClass('active')

    // level graphical nesting
    if(hideExpand && level !== 1) {
      level = level * 2
      if(level === 4) level = 5
    }
    let levelSign = new Array(level).join('·') + ' '
    el.append(levelSign)

    if(!hideExpand) {
      let expandedIcon = isExpanded ? 'expanded' : 'collapsed'
      el.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('expansion')
      )
    }

    let selectedIcon = isSelected ? 'checked' : 'unchecked'
    if(isSelected) el.addClass('sm-selected')
    el.append(
      this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
        .on('click', this._toggleFacet.bind(this, node.id)),
      $$('span').addClass('se-tree-node-name').append(node.name + ' (' + node.count.toString() + ')')
    )

    return concat(el, childrenEls)
  }

  _expandNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let topics = this.props.topics
    let isExpanded = topics.get([id, 'expanded'])
    topics.set([id, 'expanded'], !isExpanded);
    this.extendProps({
      topics: topics
    })
  }

  _toggleFacet(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let topics = this.props.topics
    let currentValue = topics.get([id, 'active'])
    topics.set([id, 'active'], !currentValue)
    this.extendProps({
      topics: topics
    })
  }

}

export default Facets
