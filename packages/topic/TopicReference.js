import { ContainerAnnotation } from 'substance'
import { forEach } from 'lodash-es'

/**
  TopicReference Node.
  Used for highlighting subject references inside documents.
*/

class TopicReference extends ContainerAnnotation {
  /**
    If this annotation is a Bracket Reference.
    Bracket References will be rendered as bracket right to the content.
    @returns {Boolean}
  */
  isBracketReference() {
    return true
  }

  /**
    If this annotation is a Resource Multiple Reference.
    Resource Multiple References are annotations with an array reference property.
    @returns {Boolean}
  */
  isResourceMultipleReference() {
    return true
  }

  /**
    If this annotation is a Resource Reference.
    Resource References are annotations with a reference property.
    @returns {Boolean}
  */
  isResourceReference() {
    return false
  }

  setHighlighted(highlighted, scope) {
    if (this.highlighted !== highlighted) {
      this.highlighted = highlighted
      this.highlightedScope = scope
      this.emit('highlighted', highlighted, scope)
      forEach(this.fragments, function(frag) {
        frag.emit('highlighted', highlighted, scope)
      })
    }
  }
}

TopicReference.define({
  type: 'topic',
  reference: {type: ["string"], default: []}
})

export default TopicReference
