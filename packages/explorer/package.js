import Explorer from './Explorer'
import SearchBar from './SearchBar'
import DocumentItem from './DocumentItem'
import ResourceEntries from './ResourceEntries'
import TopicEntries from './TopicEntries'
import ResourceReference from './ResourceReference'
import MetaFilters from './MetaFilters'
import Facets from './Facets'

export default {
  name: 'archivist-explorer',
  configure: function(config) {
    config.addPage('explorer', Explorer)
    config.addPage('resources', Explorer)
    config.addComponent('searchbar', SearchBar)
    config.addComponent('document-item', DocumentItem)
    config.addComponent('resource-entries', ResourceEntries)
    config.addComponent('topic-entries', TopicEntries)
    config.addComponent('resource-reference', ResourceReference)
    config.addComponent('meta-filters', MetaFilters)
    config.addComponent('facets', Facets)
    config.addIcon('searchbar-search', {'fontawesome': 'fa-search'})
    config.addIcon('fragment-badge', {'fontawesome': 'fa-comments-o'})
    config.addIcon('topic-badge', {'fontawesome': 'fa-tag'})
    config.addIcon('location', {'fontawesome': 'fa-map-marker'})
    config.addIcon('video', {'fontawesome': 'fa-video-camera'})
    config.addIcon('audio', {'fontawesome': 'fa-volume-up'})
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addIcon('reset-filter', { 'fontawesome': 'fa-times' })
    config.addLabel('topic-facets', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('searchbar-placeholder', {
      en: 'Enter search query',
      ru: 'Введите поисковой запрос'
    })
    config.addLabel('searchbar-submit', {
      en: 'Search',
      ru: 'Поиск'
    })
    config.addLabel('total-results', {
      en: 'Found interviews',
      ru: 'Найдено интервью'
    })
    config.addLabel('resource-suggestions', {
      en: 'Resource suggestions',
      ru: 'Словарные статьи'
    })
    config.addLabel('topic-suggestions', {
      en: 'Topics',
      ru: 'Сюжеты'
    })
    config.addLabel('no-results', {
      en: 'No results',
      ru: 'Нет результатов'
    })
    config.addLabel('no-results-info', {
      en: 'Sorry, no documents matches your query',
      ru: 'К сожалению, нам не удалось найти документов отвечающих данному запросу'
    })
    config.addLabel('min-duration', {
      en: 'min',
      ru: 'мин'
    })
    config.addLabel('fragment-count', {
      en: 'fragments',
      ru: 'фрагм.'
    })
    config.addLabel('reset-filter', {
      en: 'reset',
      ru: 'сбросить'
    })
    config.addLabel('reset-all-filters', {
      en: 'reset all filters',
      ru: 'сбросить фильтры'
    })
    config.addLabel('select-option', {
      en: 'Select your option',
      ru: 'Выберите вариант'
    })
    config.addLabel('meta-filters-title', {
      en: 'Filters',
      ru: 'Фильтры'
    })
    config.addLabel('detention_place_type', {
      en: 'Detention place type',
      ru: 'Тип места заключения/работы'
    })
    config.addLabel('forced_labor_type', {
      en: 'Forced labor type',
      ru: 'Тип работы'
    })
    config.addLabel('state-filter', {
      en: 'Interviewee state',
      ru: 'Статус'
    })
    config.addLabel('military_service-filter', {
      en: 'Military service in soviet army',
      ru: 'Служба в советской армии'
    })
    config.addLabel('sex-filter', {
      en: 'Sex',
      ru: 'Пол'
    })
    config.addLabel('place_of_birth-filter', {
      en: 'Place of birth',
      ru: 'Место рождения'
    })
    config.addLabel('year_of_birth-filter', {
      en: 'Year of birth',
      ru: 'Год рождения'
    })
    config.addLabel('enslaving_year-filter', {
      en: 'Enslaving year',
      ru: 'Год угона'
    })
    config.addLabel('homecoming_year-filter', {
      en: 'Homecoming year',
      ru: 'Год возвращения домой'
    })
    config.addLabel('interview_date-filter', {
      en: 'Interview years',
      ru: 'Годы взятия интервью'
    })
    config.addLabel('record_type-filter', {
      en: 'Record type',
      ru: 'Источник записи'
    })
    config.addLabel('project-filter', {
      en: 'Project',
      ru: 'Проект'
    })
  }
}