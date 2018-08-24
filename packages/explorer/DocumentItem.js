import { Component } from 'substance'
import { forEach, isEmpty } from 'lodash-es'
import moment from 'moment'

class DocumentItem extends Component {

  render($$) {
    let Grid = this.getComponent('grid')

    let item = this.props.item
    let index = this.props.index
    let config = this.context.config

    let urlHelper = this.context.urlHelper
    let url = urlHelper.openDocument(item.documentId)
    if(this.props.resource) url = urlHelper.openDocument(item.documentId, this.props.resource)
    if(this.props.topic) url = urlHelper.openDocument(item.documentId, this.props.resource)
    let title = $$('a')
      .addClass('se-document-title')
      .attr({href: url, target: '_blank'})
      .append(item.title)

    // Photo badge
    let photo = config.mediaServer + '/s200/' + item.cover
    if(!item.cover) photo = config.protocol + '://' + config.host + ':' + config.port + '/assets/default.png'
    let photoEl = $$('div').addClass('se-document-photo')
    photoEl.css({'background-image': 'url("' + photo + '")'})

    let el = $$('div').addClass('sc-document-item se-row').append(
      $$(Grid.Cell, {columns: 3}).addClass('se-photo').append(photoEl),
      $$(Grid.Cell, {columns: 9}).addClass('se-metadata').append(
        this.renderMetaInfo($$),
        title,
        item.summary,
        this.renderTopicBadges($$)
      )
    )
    if(this.props.resource) {
      el.on('click', this._loadResourceFragments.bind(this, item.documentId, index))
    } else {
      el.on('click', this._loadFragments.bind(this, item.documentId, index))
    }

    if(this.props.active && item.fragments) {
      el.addClass('sm-expanded')
      item.fragments.forEach(fragment => {
        let fragmentUrl = urlHelper.openFragment(item.documentId, fragment.fragmentId)
        let fragmentIcon = this.renderIcon($$, 'fragment-badge')
        el.append(
          $$('a').addClass('se-document-fragment se-row')
            .attr({href: fragmentUrl, target: '_blank'})
            .append(
              $$(Grid.Cell, {columns: 1}).addClass('se-badge').append(
                fragmentIcon,
                $$('div').addClass('se-timecode').append(fragment.time)
              ),
              $$(Grid.Cell, {columns: 11}).addClass('se-fragment').append($$('p').setInnerHTML(fragment.content))
            )
        )
      })
    }

    return el;
  }

  renderMetaInfo($$) {
    let item = this.props.item
    let el = $$('div').addClass('se-meta-info')

    if(item.interview_type) {
      el.append($$('div').addClass('se-interview-type').append(item.interview_type + ' интервью'))
    }

    if(item.location) {
      el.append($$('div').addClass('se-interview-type').append('место взятия: ' + item.location))
    }

    if(item.count) {
      el.append($$('div').addClass('se-fragments-count').append(item.count + ' ' + this.getLabel('fragment-count')))
    }

    return el
  }

  renderTopicBadges($$) {
    let item = this.props.item
    let topics = this.props.topics
    let selected = item.topics
    let urlHelper = this.context.urlHelper
    let el = $$('div').addClass('se-topic-badges')

    if(!isEmpty(topics)) {
      forEach(selected, (counter, topicId) => {
        let url = urlHelper.openDocument(item.documentId, topicId)
        let topic = topics.find(t => { return t.entityId === topicId })
        el.append(
          $$('a')
            .addClass('se-topic-badge')
            .attr({href: url, target: '_blank'})
            .append(
              this.renderIcon($$, 'topic-badge'),
              topic.name + ' (' + counter + ')'
            )
        )
      })
    }

    return el
  }

  renderIcon($$, icon) {
    let iconEl = this.context.iconProvider.renderIcon($$, icon)
    return iconEl
  }

  _loadFragments(documentId, index) {
    this.send('loadFragments', documentId, index)
  }

  _loadResourceFragments(documentId, index) {
    this.send('loadResourceFragments', documentId, index)
  }
}

export default DocumentItem
