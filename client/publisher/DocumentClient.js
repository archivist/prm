import { request, DocumentClient } from 'substance'

/*
  HTTP client for talking with DocumentServer
*/

class ArchivistDocumentClient extends DocumentClient {
  constructor(config) {
    super(config)
    this.authClient = config.authClient
  }

  request(method, url, data, cb) {
    let request = new XMLHttpRequest();
    request.open(method, url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.setRequestHeader('x-access-token', this.authClient.getSessionToken())
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let res = request.responseText;
        if(isJson(res)) res = JSON.parse(res);
        cb(null, res);
      } else {
        return cb(new Error('Request failed. Returned status: ' + request.status))
      }
    }

    if (data) {
      request.send(JSON.stringify(data))
    } else {
      request.send()
    }
  }

  /*
    Create a new document on the server
    ```js
    @example
    ```
    documentClient.createDocument({
      schemaName: 'prose-article',
      info: {
        userId: 'userx'
      }
    });
  */
  createDocument(newDocument, cb) {
    this.request('POST', this.config.httpUrl, newDocument, cb)
  }

  /*
    Remove a document from the server
    @example
    ```js
    documentClient.deleteDocument('mydoc-id');
    ```
  */
  deleteDocument(documentId, cb) {
    this.request('DELETE', this.config.httpUrl+documentId, null, cb)
  }

  listDocuments(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    request('GET', '/api/documents?&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  getReferences(resourceId, filters, options, cb) {
    filters['annotations @>'] = [resourceId]
    return this.listDocuments(filters, options, cb)
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
}

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export default ArchivistDocumentClient