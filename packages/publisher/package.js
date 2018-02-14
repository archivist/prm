import PrmPublisherLayout from './PrmPublisherLayout'
import { BracketsPackage, CollaboratorsPackage, TabbedContextPackage } from 'archivist-js'
import { ContainerAnnotationPackage, FindAndReplacePackage } from 'substance'

export default {
  name: 'prm-publisher',
  configure: function(config) {
    config.import(BracketsPackage)
    config.import(CollaboratorsPackage)
    config.import(TabbedContextPackage)
    config.addComponent('editor', PrmPublisherLayout)

    config.import(ContainerAnnotationPackage)
    config.import(FindAndReplacePackage, {
      targetSurfaces: ['body']
    })

    // Configure overlay
    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'tool-group',
        commandGroups: ['prompt']
      }
    ])

    config.addToolPanel('workflow', [
      {
        name: 'workflow',
        type: 'tool-group',
        commandGroups: ['workflows']
      }
    ])

    // Configure toolbar
    config.addToolPanel('toolbar', [
      {
        name: 'text-types',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['text-types']
      },
      {
        name: 'document',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['undo-redo']
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['annotations']
      },
      {
        name: 'references',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['references']
      },
      {
        name: 'utils',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['utils']
      }
    ])

    config.addLabel('find-and-replace-title', {
      en: 'Find and Replace',
      ru: 'Поиск и замена'
    })
  }
}
