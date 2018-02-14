import { ContainerAnnotationPackage } from 'substance'

const { ContainerAnnotationCommand } = ContainerAnnotationPackage

class TopicCommand extends ContainerAnnotationCommand {

  canCreate(annos, sel) {
    let canCreate = !sel.isCollapsed()
    if(annos.length > 0) {
      annos.forEach(a => {
        if(a.highlighted) canCreate = false
      })
    }
    return canCreate
  }

  canDelete() {
    return false
  }

  canFuse() {
    return false
  }

  canTruncate(annos, sel) {
    if (annos.length !== 1) return false
    if (!annos[0].highlighted) return false
    let annoSel = annos[0].getSelection()

    return (sel.isLeftAlignedWith(annoSel) || sel.isRightAlignedWith(annoSel)) &&
           !sel.contains(annoSel) &&
           !sel.isCollapsed()
  }

  canExpand(annos, sel) {
    // When there's some overlap with only a single annotation we do an expand
    if (annos.length !== 1) return false
    if (!annos[0].highlighted) return false
    let annoSel = annos[0].getSelection()
    return sel.overlaps(annoSel) && !sel.isInsideOf(annoSel)
  }

  executeCreate(params) {
    let annos = this._getAnnotationsForSelection(params)
    this._checkPrecondition(params, annos, this.canCreate)
    let editorSession = this._getEditorSession(params)
    editorSession.emit('createTopicReference')
    return {
      mode: 'create'
    }
  }
}

export default TopicCommand
