import { AnnotationCommand } from 'substance'

class EntityReferenceCommand extends AnnotationCommand {
  executeCreate(params) {
    let annos = this._getAnnotationsForSelection(params)
    this._checkPrecondition(params, annos, this.canCreate)
    let editorSession = this._getEditorSession(params)
    editorSession.emit('createInlineEntityReference', params)
    return {
      
    }
  }
}

export default EntityReferenceCommand