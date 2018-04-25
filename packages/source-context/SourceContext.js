import { Component, DefaultDOMElement } from 'substance'
import { filter, forEach } from 'lodash-es'
import moment from 'moment'

class SourceContext extends Component {

  didMount() {
    // recalculate width when window gets resized
    DefaultDOMElement.getBrowserWindow().on('resize', this._updatePosition, this)
    this._updatePosition()
  }

  dispose() {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  didUpdate() {
    this._updatePosition()
  }

  render($$) {
    let el = $$('div').addClass('sc-context-panel')

    let interviewMainData = $$('div').addClass('se-interview-info se-section').append(
      this._renderMetaProp($$, 'title'),
      this._renderMetaProp($$, 'short_summary'),
      this._renderMetaProp($$, 'interview_location', () => {
        return this._getLocationName()
      })
    )

    let respondentData = $$('div').addClass('se-respondent-data se-section').append(
      this._renderMetaProp($$, 'respondent_year_of_birth'),
      this._renderMetaProp($$, 'respondent_profession'),
      this._renderMetaProp($$, 'respondent_bio')
    )

    let interviewData = $$('div').addClass('se-interview-data se-section').append(
      this._renderMetaProp($$, 'interview_record_type', (value) => {
        return this.getLabel('meta-source-' + value)
      }),
      this._renderMetaProp($$, 'interview_duration'),
      this._renderMetaProp($$, 'interview_type'),
      this._renderMetaProp($$, 'interview_date', date => {
        return moment(date).format('DD.MM.YYYY')
      }),
      this._renderMetaProp($$, 'interview_conductor'),
      this._renderMetaProp($$, 'interview_persons_present'),
      this._renderMetaProp($$, 'interview_transcriber'),
      this._renderMetaProp($$, 'comment'),
      this._renderTopics($$)
    )

    el.append(
      this._renderCover($$),
      interviewMainData,
      $$('div').addClass('se-section-title').append(this.getLabel('meta-respondent-data')),
      respondentData,
      $$('div').addClass('se-section-title').append(this.getLabel('meta-interview-data')),
      interviewData,
      $$('a').addClass('se-fpr-logo').attr({href:'https://президентскиегранты.рф',target:'_blank'}).append(
        $$('img').attr('src', '/assets/fpg.png')
      )
    )

    return el
  }

  _renderMetaProp($$, prop, transformer) {
    let doc = this.context.doc
    let metadata = doc.getDocumentMeta()
    let value = metadata[prop]
    if(!value) {
      return
    }
    if(transformer) {
      value = transformer(value)
    }
    return $$('div').addClass('se-meta-prop se-meta-' + prop).append(
      $$('div').addClass('se-meta-label').append(this.getLabel('meta-' + prop)),
      $$('div').addClass('se-meta-value').append(value)
    )
  }

  _renderCover($$) {
    let config = this.context.config
    let doc = this.context.doc
    let metadata = doc.getDocumentMeta()
    let cover = metadata.cover

    if(metadata.interview_record_type === 'video' || metadata.interview_record_type === 'audio' || !cover) return

    return $$('div').addClass('se-cover se-section').append(
      $$('img').attr({src: config.mediaPath + '/' + cover})
    )
  }

  _renderTopics($$) {
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

    if(activeNodes.length === 0) return

    let el = $$('div').addClass('se-meta-prop se-meta-topics')
    let values = []

    activeNodes.forEach(topic => {
      let item = $$('a').addClass('se-topic')
        .attr({href: '/resources/' + topic.entityId, target: '_blank'})
        .append(topic.name)

      if(this.state.selected === topic.entityId) {
        item.addClass('sm-active')
      }

      values.push(item)
    })

    el.append(
      $$('div').addClass('se-meta-label').append(this.getLabel('meta-topics')),
      $$('div').addClass('se-meta-value').append(values)
    )

    return el
  }

  _getLocationName() {
    const editorSession = this.context.editorSession
    const location = editorSession.location

    if(!location) return
    return location.name
  }

  _updatePosition() {
    let readerContext = this.context.readerContext
    let player = readerContext.getPlayer()
    let playerHeight = player.el.getHeight()
    this.el.css({top: playerHeight})
  }
}

export default SourceContext
