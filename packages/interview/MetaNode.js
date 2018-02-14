import { DocumentNode } from 'substance'

/**
  Interview metadata container, holds interview metadata
*/

class MetaNode extends DocumentNode {}

// интервью:
// Название интервью (ФИО)
// Место взятия интервью (выбирается из статей географического указателя)
// Дата взятия интервью
// Тип записи интервью (аудио или видео)
// Тип интервью (или институция)
// Теги тем
// Длительность
// Интервьюер
// Присутствующие лица
// Расшифровщик
// Идентификатор исходного файла
//
// респондент:
// Тип респондента
// Пол респондента
// Год рождения респондента
// Семейное положение респондента
// Сфера занятости респондента
// Миграция (биография респондента)
//
// прочее:
// Фотография
// Коллекция
// Короткая аннотация (в список)
// Аннотация
// Комментарий


MetaNode.define({
  type: 'meta',

  title: {type: 'string', default: 'Безымянное интервью', field: {editor: "text", description: "Название интервью", group: 'Interview Data'}},
  interview_location: {type: 'string', default: '', field: { editor: "reference", entityType: ["geofeature"], multi: false, description: "Место взятия интервью", group: 'Interview Data'}},
  interview_date: {type: 'string', default: '', field: {editor: "input", dataType: "date", description: "Дата взятия интервью (yyyy-MM-dd)", group: 'Interview Data'}},
  interview_record_type: {type: 'string', default: '', field: {editor: "select", description: "Тип записи интервью", options: ['audio', 'video', 'text'], group: 'Interview Data'}},
  interview_type: {type: 'string', default: '', field: {editor: "select", description: "Тип интервью", options: ['волонтерское', 'профессиональное'], group: 'Interview Data'}},
  // interview_topics: {type: 'array', default: [], field: {editor: "reference", entityType: ["topic"], multi: true, description: "Темы интервью", group: 'Interview Data'}},
  interview_duration: {type: 'number', default: 0, field: {editor: "input", dataType: "number", description: "Длинна интервью", group: 'Interview Data'}},
  interview_conductor: {type: 'string', default: '', field: {editor: "text", description: "Интервьюер", group: 'Interview Data'}},
  interview_persons_present: { type: 'string', default: '', field: {editor: "text", description: "Присутствующие лица", group: 'Interview Data'}},
  interview_transcriber: {type: 'string', default: '', field: {editor: "text", description: "Расшифровщик", group: 'Interview Data'}},
  interview_media_id: {type: 'string', default: '', field: {editor: "text", description: "Идентификатор исходного файла", group: 'Interview Data'}},

  // respondent_type: {type: 'string', default: '', field: {editor: "text", description: "Тип респондента", group: 'Respondent Data'}},
  respondent_sex: {type: 'string', default: '', field: {editor: "select", description: "Пол респондента", options: ['мужчина', 'женщина'], group: 'Respondent Data'}},
  respondent_year_of_birth: {type: 'string', default: '', field: {editor: "input", dataType: "text", description: "Год рождения респондента", group: 'Respondent Data'}},
  respondent_marital_status: {type: 'string', default: '', field: {editor: "text", description: "Семейное положение респондента", group: 'Respondent Data'}},
  respondent_activities: {type: 'string', default: '', field: {editor: "text", description: "Сфера занятости респондента", group: 'Respondent Data'}},
  respondent_bio: {type: 'string', default: '', field: {editor: "text", description: "Биография респондента", group: 'Respondent Data'}},

  collection: {type: 'string', default: '', field: {editor: "reference", entityType: ["collection"], description: "Укажите коллекцию", group: 'Other'}},
  short_summary: {type: 'string', default: '', field: {editor: "multitext", description: "Введите короткую аннотацию", group: 'Other'}},
  abstract: {type: 'string', default: '', field: {editor: "multitext", description: "Введите аннотацию", group: 'Other'}},
  comment: {type: 'string', default: '', field: {editor: "multitext", description: "Введите комментарий", group: 'Other'}},
  published_on: {type: 'string', default: '', field: {editor: "input", dataType: "date", description: "Дата публикации (yyyy-MM-dd)", group: 'Other'}},
  state: { type: 'string', default: '', field: { editor: "select", description: "Статус документа", options: ['transcripted', 'verified', 'finished', 'published'], group: 'Other'}}
})

export default MetaNode
