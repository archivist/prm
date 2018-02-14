import { request, DocumentClient } from 'substance'

/*
  HTTP client for talking with DocumentServer
*/

class ScholarDocumentClient extends DocumentClient {

  listDocuments(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  getReferences(resourceId, filters, options, cb) {
    filters['annotations @>'] = [resourceId]
    return this.listDocuments(filters, options, cb)
  }

  getResourceDocuments(resourceId, cb) {
    request('GET', '/api/documents/resource/' + resourceId + '?public=true', null, cb)
  }

  searchDocuments(query, language, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents/search?query=' + query + '&language=' + language + '&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  searchFragments(documentId, query, language, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents/' + documentId + '/search?query=' + query + '&language=' + language + '&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  loadFragments(documentId, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents/' + documentId + '/search?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  loadMetaOptionValues(options, cb) {
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents/options/values?props=' + optionsRequest, null, cb)
  }
}

export default ScholarDocumentClient