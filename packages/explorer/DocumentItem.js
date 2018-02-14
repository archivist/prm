import { Component } from 'substance'
import { forEach, isEmpty } from 'lodash-es'
import moment from 'moment'

class DocumentItem extends Component {

  render($$) {
    let Grid = this.getComponent('grid')

    let item = this.props.item
    let meta = item.meta
    let index = this.props.index
    let config = this.context.config
    
    let urlHelper = this.context.urlHelper
    let url = urlHelper.openDocument(item.documentId)
    if(this.props.resource) url = urlHelper.openDocument(item.documentId, this.props.resource)
    if(this.props.topic) url = urlHelper.openDocument(item.documentId, false, this.props.resource)
    let title = $$('a')
      .addClass('se-document-title')
      .attr({href: url, target: '_blank'})
      .append(item.title)

    // Photo badge
    let photo = config.mediaServer + '/photos/' + meta.interviewee_photo
    if(!meta.interviewee_photo) photo = config.protocol + '://' + config.host + ':' + config.port + '/assets/default.png'
    let photoEl = $$('div').addClass('se-document-photo')
    photoEl.css({'background-image': 'url(' + photo + ')'})

    let el = $$('div').addClass('sc-document-item se-row').append(
      $$(Grid.Cell, {columns: 2}).addClass('se-photo').append(photoEl),
      $$(Grid.Cell, {columns: 10}).addClass('se-metadata').append(
        this.renderMetaInfo($$),
        title,
        meta.short_summary,
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
    let meta = item.meta
    let el = $$('div').addClass('se-meta-info')

    if(meta.project_name) {
      el.append($$('div').addClass('se-project-name').append(meta.project_name))
    }

    if(meta.interview_duration) {
      el.append($$('div').addClass('se-record-duration').append(meta.interview_duration + ' ' + this.getLabel('min-duration')))
    }

    if(meta.interview_date) {
      el.append($$('div').addClass('se-record-date').append(moment(meta.interview_date).format('DD.MM.YYYY')))
    }

    if(meta.record_type) {
      el.append($$('div').addClass('se-record-type').append(this.renderIcon($$, meta.record_type)))
    }

    if(item.count) {
      el.append($$('div').addClass('se-fragments-count').append(item.count + ' ' + this.getLabel('fragment-count')))
    }

    return el
  }

  renderTopicBadges($$) {
    let item = this.props.item
    let topicsTree = this.props.topics
    let topics = item.topics
    let urlHelper = this.context.urlHelper
    let el = $$('div').addClass('se-topic-badges')

    if(!isEmpty(topics)) {
      forEach(topics, (counter, topic) => {
        let url = urlHelper.openDocument(item.documentId, false, topic)
        let name = topicsTree.get([topic, 'name'])
        el.append(
          $$('a')
            .addClass('se-topic-badge')
            .attr({href: url, target: '_blank'})
            .append(
              this.renderIcon($$, 'topic-badge'),
              name + ' (' + counter + ')'
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
