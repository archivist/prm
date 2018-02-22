import DocumentsPage from './DocumentsPage'

export default {
  name: 'archivist-documents',
  configure: function(config) {
    config.addPage('archive', DocumentsPage)
    config.addLabel('archive', {
      en: 'Documents',
      ru: 'Документы'
    })
    config.addLabel('documents', {
      en: 'Documents',
      ru: 'Документы'
    })
    config.addLabel('add-document', {
      en: '+ New Document',
      ru: '+ Добавить документ'
    })
    config.addLabel('add-pro-document', {
      en: '+ New Professional Document',
      ru: '+ Интервью (проф.)'
    })
    config.addLabel('add-volunteer-document', {
      en: '+ New Volunteer Document',
      ru: '+ Интервью (вол.)'
    })
    config.addLabel('select-document-state', {
      en: 'Select state',
      ru: 'Статус документа'
    })
    config.addLabel('select-interview-type', {
      en: 'Select type',
      ru: 'Тип интервью'
    })
    config.addLabel('select-birth-year', {
      en: 'Select birth year',
      ru: 'Год рождения'
    })
    config.addLabel('select-respondent-sex', {
      en: 'Select sex',
      ru: 'Пол респондента'
    })
    config.addLabel('sort-updated', {
      en: 'Sort by date',
      ru: 'По дате'
    })
    config.addLabel('sort-alphabet', {
      en: 'Sort by title',
      ru: 'По названию'
    })
    config.addLabel('interview-location-filter-label', {
      en: 'Interview location',
      ru: 'Место взятия'
    })
    config.addLabel('interview-location-filter-default', {
      en: 'Any',
      ru: 'Любое'
    })
    config.addLabel('interview-topic-filter-label', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('interview-topic-filter-default', {
      en: 'Any',
      ru: 'Любые'
    })
    config.addLabel('interview-collection-filter-label', {
      en: 'Collection',
      ru: 'Коллекция'
    })
    config.addLabel('interview-collection-filter-default', {
      en: 'Any',
      ru: 'Любая'
    })
  }
}
