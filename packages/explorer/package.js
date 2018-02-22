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
    config.addLabel('interview_location-filter', {
      en: 'Interview location',
      ru: 'Место взятия интервью'
    })
    config.addLabel('interview_type-filter', {
      en: 'Interview type',
      ru: 'Тип интервью'
    })
    config.addLabel('respondent_sex-filter', {
      en: 'Respondent Sex',
      ru: 'Пол респондента'
    })
    config.addLabel('year_of_birth-filter', {
      en: 'Year of birth',
      ru: 'Год рождения респондента'
    })
    config.addLabel('interview_record_type-filter', {
      en: 'Record type',
      ru: 'Источник записи'
    })
  }
}
