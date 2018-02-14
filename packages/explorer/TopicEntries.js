import { Component } from 'substance'
import { forEach } from 'lodash-es'

class TopicEntries extends Component {
  render($$) {
    let el = $$('div').addClass('sc-topic-entries se-panel')
    let entries = this.props.entries

    if(entries) {
      el.append($$('div').addClass('se-title').append(this.getLabel('topic-suggestions')))
      forEach(entries, entry => {
        let name = entry.description || entry.name
        el.append(
          $$('span').addClass('se-entry')
            .append(name)
            .on('click', this._openTopic.bind(this, entry.entityId))
        )
      })
    }

    return el
  }

  _openTopic(topicId) {
    this.send('openTopic', topicId)
  }
}

export default TopicEntries