import { Document } from 'substance'
import { each, isEmpty, map } from 'lodash-es'
import SubjectsIndex from './SubjectsIndex'

/*
  Subjects model.

  Holds all subjects.
*/
class Subjects extends Document {
  constructor(schema) {
    super(schema)

    this.addIndex('subjects', new SubjectsIndex(this))
  }
  
  // Get children nodes for a given node
  getChildren(nodeId) {
    let index = this.getIndex('subjects').index
    let children = index.get(nodeId)

    if(children) {
      return children.subject
    } else {
      return {}
    }
  }

  // Collect all children nodes of a node
  // returns list of ids
  getAllChildren(nodeId) {
    let childNodes = this.getChildren(nodeId)
    if (childNodes.length === 0) return []
    let allChildren = map(childNodes, 'id')
    each(childNodes, function(childNode) {
      allChildren = allChildren.concat(this.getAllChildren(childNode.id))
    }.bind(this))
    return allChildren
  }

  // Check if node has any children
  hasChildren(nodeId) {
    let children = this.getChildren(nodeId)
    return !isEmpty(children)
  }

  hasParent(node) {
    if(!node) return false
    return Boolean(node.parent) && node.parent !== 'root'
  }

  // Get parent node for a given nodeId
  getParent(nodeId) {
    return this.get(nodeId).getParent()
  }

  // Collect all parents of a given node
  // returns list of ids
  getParents(nodeId) {
    let node = this.get(nodeId)
    let parents = []
    while (this.hasParent(node)) {
      node = node.getParent()
      if(node) parents.push(node.id)
    }
    return parents
  }

  // Get root parent node
  getRootParent(nodeId) {
    return this.get(nodeId).getRoot()
  }

  // Get all root nodes
  getRoots() {
    let index = this.getIndex('subjects').index
    if(index.root) {
      return index.root.subject
    } else {
      return []
    }
  }

  // Get ids of all active nodes
  getActive() {
    let active = []
    let subjectNodes = this.getIndex('type').get('subject')
    each(subjectNodes, function(node) {
      if(node.active) active.push(node.id)
    })
    return active
  }

  // Whatever children of given node has active prop
  hasActiveChildren(nodeId) {
    let result = false
    let children = this.getAllChildren(nodeId)
    each(children, function(childId) {
      let node = this.get(childId)
      if(node.active) {
        result = true
        return false
      }
    }.bind(this))
    return result
  }

  // Get ids of all selected nodes
  getSelected() {
    let selected = []
    let subjectNodes = this.getIndex('type').get('subject')
    each(subjectNodes, function(node) {
      if(node.selected) selected.push(node.id)
    })
    return selected
  }

  // Whatever children of given node has selected prop
  hasSelectedChildren(nodeId) {
    let result = false
    let children = this.getAllChildren(nodeId)
    each(children, function(childId) {
      let node = this.get(childId)
      if(node.selected) {
        result = true
        return false
      }
    }.bind(this))
    return result
  }

  // Resets selections for all nodes
  resetSelection() {
    let nodes = this.getNodes()
    each(nodes, function(node) {
      if(node.selected) {
        this.set([node.id, 'selected'], false)
      }
    }.bind(this))
  }

  resetTree() {
    let nodes = this.getNodes()
    each(nodes, node => {
      if(node.active) {
        this.set([node.id, 'active'], false)
      }

      if(node.expanded) {
        this.set([node.id, 'expanded'], false)
      }
    })
  }
}

export default Subjects
