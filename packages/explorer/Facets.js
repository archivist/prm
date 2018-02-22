import { Component } from 'substance'
import { concat, flattenDeep, isEmpty, map } from 'lodash-es'

class Facets extends Component {

  render($$) {
    const topics = this.props.topics
    const facets = this.props.facets

    let el = $$('div').addClass('sc-facets se-panel').append(
      $$('div').addClass('se-title').append(this.getLabel('topic-facets'))
    )

    topics.forEach(topic => {
      let item = $$('div').addClass('se-tree-node')
        .attr("href", '#topic=' + topic.entityId)
        .append(topic.name + ' (' + topic.cnt + ')')
        .ref(topic.entityId)
        .on('click', this._toggleFacet.bind(this, topic.entityId))

      if(facets.indexOf(topic.entityId) > -1) {
        item.addClass('sm-active')
      }

      el.append(item)
    })

    return el
  }

  _toggleFacet(id) {
    let facets = this.props.facets.slice(0)
    let pos = facets.indexOf(id)
    if(pos > -1) {
      facets.splice(pos, 1)
    } else {
      facets.push(id)
    }

    this.send('changeTopicFacets', facets)
  }

}

export default Facets
