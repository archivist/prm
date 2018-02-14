import TopicReference from './TopicReference'
import TopicCommand from './TopicCommand'
import TopicComponent from './TopicComponent'

export default {
  name: 'topic',
  configure: function(config) {
    config.addNode(TopicReference)
    config.addCommand(TopicReference.type, TopicCommand, { nodeType: TopicReference.type, commandGroup: 'references' })
    config.addComponent(TopicReference.type, TopicComponent)
    config.addIcon(TopicReference.type, {'fontawesome': 'fa-tags'})

    config.addLabel('topic', {
      en: 'topic reference',
      ru: 'связать с темой'
    })
  }
}
