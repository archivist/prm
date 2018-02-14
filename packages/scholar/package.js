import { BasePackage } from 'substance'
import { DocumentPackage, PagerPackage, SpinnerPackage, ToolboxPackage } from 'archivist-js'

export default {
  name: 'scholar',
  configure: function(config) {
    config.import(BasePackage)
    config.import(DocumentPackage)
    config.import(PagerPackage)
    config.import(SpinnerPackage)
    config.import(ToolboxPackage)
  }
}