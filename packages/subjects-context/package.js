import SubjectsContext from './SubjectsContext'

export default {
  name: 'archivist-reader-subjects',
  configure: function(config) {
    config.addContext('subjects', SubjectsContext, false)
    config.addIcon('subjects', {'fontawesome': 'fa-tags'})
    config.addLabel('subjects', {
      en: 'Subjects',
      ru: 'Темы'
    })
  }
}
