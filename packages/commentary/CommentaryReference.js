import { Fragmenter, PropertyAnnotation } from 'substance'

class CommentaryReference extends PropertyAnnotation {
  /**
    If this annotation is a Resource Reference.
    Resource References are annotations with a reference property.
    @returns {Boolean}
  */
  isResourceReference() {
    return true
  }

  /**
    If this annotation is a Resource Multiple Reference.
    Resource Multiple References are annotations with an array reference property.
    @returns {Boolean}
  */
  isResourceMultipleReference() {
    return false
  }

  setHighlighted(highlighted, scope) {
    if (this.highlighted !== highlighted) {
      this.highlightedScope = scope
      this.highlighted = highlighted
      this.emit('highlighted', highlighted)
    }
  }
}

CommentaryReference.define({
  type: "commentary",
  reference: { type: 'string', optional: true }
})

// a hint that makes in case of overlapping annotations that this
// annotation gets fragmented more often
CommentaryReference.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default CommentaryReference