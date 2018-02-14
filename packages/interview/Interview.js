import { Document } from 'substance'
import { EntityIndex } from 'archivist-js'
import { map } from 'lodash-es'
/*
  Archivist Interview model.
*/

class Interview extends Document {
  
  _initialize() {
    super._initialize()

    this.create({
      type: 'container',
      id: 'body',
      nodes: []
    })

    this.addIndex('entities', new EntityIndex())
  }

  getDocumentMeta() {
    return this.get('meta')
  }

  getPathRange(startNode, endNode) {
    let container = this.get('body')
    let startPos = container.getPosition(startNode)
    let endPos = container.getPosition(endNode)
    let range = []
    for (let pos = startPos; pos <= endPos; pos++) {
      let node = container.getNodeAt(pos)
      range.push(node.id)
    }

    return range
  }

  getFirst(nodes) {
    let container = this.get('body')
    let positions = map(nodes, node => { return container.getPosition(node)})
    positions.sort(function(a, b) {
      return a - b
    })

    return container.getNodeAt(positions[0]).id
  }

}

export default Interview