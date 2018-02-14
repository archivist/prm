import EntityReferenceCommand from './EntityReferenceCommand'

export default {
  name: 'entity-reference',
  configure: function(config) {
    config.addCommand('entity-reference', EntityReferenceCommand, { nodeType: 'entity-reference', commandGroup: 'references' })
    config.addIcon('entity-reference', {'fontawesome': 'fa-book'})
    config.addLabel('entity-reference', {
      en: 'entity reference',
      ru: 'связать с сущностью'
    })

    config.addKeyboardShortcut('CommandOrControl+E', { command: 'entity-reference' })
  }
}