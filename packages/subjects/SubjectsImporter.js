import { HTMLImporter } from 'substance'
import { each } from 'lodash-es'

let converters = []

class SubjectsImporter extends HTMLImporter {

  importDocument(subjectsData, reader, facets) {
    this.reset()

    let doc = this.state.doc
    each(subjectsData, function(subject) {
      if(reader) {
        doc.create({
          id: subject.entityId,
          type: 'subject',
          name: subject.name,
          position: subject.position || subject.pos,
          count: subject.cnt ? parseInt(subject.cnt, 10) : 0,
          parent: subject.parent || 'root',
          active: facets ? facets.indexOf(subject.entityId) > -1 : false
        })
      } else {
        doc.create({
          id: subject.entityId,
          type: 'subject',
          name: subject.data.name,
          workname: subject.data.workname,
          position: subject.data.position,
          count: parseInt(subject.count, 10),
          edited: subject.edited,
          updatedBy: subject.updatedBy,
          description: subject.data.description,
          parent: subject.data.parent || 'root'
        })
      }
    })

    return doc
  }

  /*
    Takes an HTML string.
  */
  convertDocument(bodyEls) {
    // Just to make sure we always get an array of elements
    if (!bodyEls.length) bodyEls = [bodyEls]
    this.convertContainer(bodyEls, 'body')
  }
}

SubjectsImporter.converters = converters

export default SubjectsImporter
