import { ContainerAnnotationPackage } from 'substance'
import { BracketsPackage, TabbedContextPackage } from 'archivist-js'
import ReaderLayout from './ReaderLayout'

export default {
  name: 'archivist-reader',
  configure: function(config) {
    config.import(BracketsPackage)
    config.import(TabbedContextPackage)
    config.addComponent('reader', ReaderLayout)

    config.import(ContainerAnnotationPackage)
    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'tool-group',
        commandGroups: ['prompt']
      }
    ])
  }
}