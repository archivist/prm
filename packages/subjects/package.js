import Subjects from './Subjects'
import Subject from './Subject'
import SubjectConverter from './SubjectConverter'
import SubjectsImporter from './SubjectsImporter'

export default {
  name: 'subjects',
  configure: function(config) {
    config.defineSchema({
      name: 'archivist-subjects',
      version: '1.0.0',
      DocumentClass: Subjects,
      defaultTextType: 'subject'
    })

    config.addNode(Subject)
    config.addConverter('subjects', SubjectConverter)
    config.addImporter('subjects', SubjectsImporter)
  }
}
