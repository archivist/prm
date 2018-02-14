import { DocumentNode } from 'substance'

/*
  Subject node.
  Holds Subject entity.

  Attributes
    - name Subject name
    - workname Working name of subject
    - parent Id of parent subject
    - position Position of subject within it's branch
    - description Subject description
*/
class Subject extends DocumentNode {
  // Get entity name
  getName() {
    return this.name
  }

  // Get entity description
  getDescription() {
    return this.description
  }

  // Get entity synonyms
  getSynonyms() {
    let synonyms = []
    return synonyms
  }
}

Subject.type = 'subject'

Subject.define({
  name: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "subject-name-placeholder" }},
  workname: { type: 'string', default: '' },
  parent: { type: 'id', optional: true },
  position: { type: 'number', default: 0 },
  description: { type: 'string', default: '', field: { type: "prose", placeholder: "subject-description-placeholder" }},
  count: { type: 'number', default: 0 },
  edited: { type: 'string', default: '' },
  updatedBy: { type: 'string', default: '' },
  active: { type: 'boolean', default: false },
  expanded: { type: 'boolean', default: false }
})

export default Subject
