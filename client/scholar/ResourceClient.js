import { request } from 'substance'

/*
  HTTP client for talking with ResourceServer
*/

class ResourceClient {
  constructor(config) {
    this.config = config
  }

  /*
    Read all document resources
  */
  getDocumentResources(documentId, cb) {
    request('GET', '/api/entities/document/' + documentId, null, cb)
  }

  /*
    Get topics facets data
  */
  getTopicsFacets(filters, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    request('GET', '/api/entities/facets/topic?filters=' + filtersRequest , null, cb)
  }

  /*
    Read an entity
  */
  getEntity(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb)
  }

  /*
    List entities
  */
  listEntities(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/entities?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Search entities
  */
  searchEntities(query, language, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/entities/search?query=' + query + '&language=' + language + '&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Get top entity results for search query
  */
  searchTopResources(query, language, cb) {
    request('GET', '/api/entities/search/top?query=' + query + '&language=' + language, null, cb)
  }

  /*
    Get topic results for search query
  */
  searchTopics(query, language, cb) {
    request('GET', '/api/entities/search/topics?query=' + query + '&language=' + language, null, cb)
  }

  /*
    Get list of all locations as geoJSON
  */
  getLocationsList(cb) {
    request('GET', '/api/entities/locations', null, cb)
  }

  /*
    Get list of all global persons
  */
  getPersonsList(letter, options, cb) {
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/entities/persons?letter=' + letter + '&options=' + optionsRequest, null, cb)
  }

  /*
    Get list of person first letters with counters
  */
  getPersonsStats(cb) {
    request('GET', '/api/entities/persons/stats', null, cb)
  }

}

export default ResourceClient
