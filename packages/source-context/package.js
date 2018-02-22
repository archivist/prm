import SourceContext from './SourceContext'
import SourcePlayerOverlay from './SourcePlayerOverlay'

export default {
  name: 'archivist-reader-source',
  configure: function(config) {
    config.addContext('source', SourceContext, true)
    config.addComponent('source-player', SourcePlayerOverlay)
    config.addIcon('source', {'fontawesome': 'fa-info'})
    config.addLabel('source', {
      en: 'Information',
      ru: 'Информация'
    })
    config.addLabel('meta-title', {
      en: 'Respondent',
      ru: 'Респондент'
    })
    config.addLabel('meta-short_summary', {
      en: 'Summary',
      ru: 'Описание'
    })
    config.addLabel('meta-interview_location', {
      en: 'Interview Location',
      ru: 'Место записи'
    })
    config.addLabel('meta-respondent_year_of_birth', {
      en: 'Date of Birth',
      ru: 'Дата рождения'
    })
    config.addLabel('meta-respondent_bio', {
      en: 'Biography',
      ru: 'Биография'
    })
    config.addLabel('meta-interview_record_type', {
      en: 'Source',
      ru: 'Источник'
    })
    config.addLabel('meta-interview_duration', {
      en: 'Duration',
      ru: 'Длительность'
    })
    config.addLabel('meta-interview_type', {
      en: 'Interview Type',
      ru: 'Тип интервью'
    })
    config.addLabel('meta-interview_date', {
      en: 'Interview Date',
      ru: 'Дата взятия'
    })
    config.addLabel('meta-interview_conductor', {
      en: 'Interview Conductor',
      ru: 'Интервьюер'
    })
    config.addLabel('meta-interview_persons_present', {
      en: 'Persons Present',
      ru: 'Присутствующие лица'
    })
    config.addLabel('meta-interview_transcriber', {
      en: 'Transcriber',
      ru: 'Расшифровщик'
    })
    config.addLabel('meta-comment', {
      en: 'Comment',
      ru: 'Комментарий'
    })
    config.addLabel('meta-topics', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('meta-respondent-data', {
      en: 'Respondent Data',
      ru: 'Данные респондента'
    })
    config.addLabel('meta-interview-data', {
      en: 'Interview Data',
      ru: 'Данные интервью'
    })
    config.addLabel('meta-source-video', {
      en: 'Video',
      ru: 'Видео'
    })
    config.addLabel('meta-source-audio', {
      en: 'Audio',
      ru: 'Аудио'
    })
    config.addLabel('meta-source-text', {
      en: 'Text',
      ru: 'Текст'
    })
  }
}
