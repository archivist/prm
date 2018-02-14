import { request } from 'substance'

/*
  HTTP client for talking with ResourceServer
*/

class ResourceClient {
  constructor(config) {
    this.config = config
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
    Create an entity
  */
  createEntity(entityData, cb) {
    this.request('POST', '/api/entities', entityData, cb)
  }

  /*
    Read an entity
  */
  getEntity(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb)
  }

  /*
    Update an entity
  */
  updateEntity(entityId, entityData, cb) {
    this.request('PUT', '/api/entities/' + entityId, entityData, cb)
  }

  /*
    Update entities
  */
  updateEntities(entityData, cb) {
    this.request('POST', '/api/entities/tree/update', entityData, cb)
  }

  /*
    Remove an entity
  */
  deleteEntity(entityId, cb) {
    this.request('DELETE', '/api/entities/' + entityId, null, cb)
  }

  /*
    Merge two entities
  */
  mergeEntity(entityId, mergeEntityId, type, cb) {
    let entityData = {
      mergeEntity: entityId,
      targetEntity: mergeEntityId
    }
    if(type) entityData.type = type
    this.request('POST', '/api/entities/merge', entityData, cb)
  }

  listEntities(filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/entities?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  searchEntities(query, language, filters, options, cb) {
    let filtersRequest = encodeURIComponent(JSON.stringify(filters))
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    this.request('GET', '/api/entities/search?query=' + query + '&language=' + language + '&filters=' + filtersRequest + '&options=' + optionsRequest, null, cb)
  }

  /*
    Fetch all document resources
  */
  getDocumentCollaborators(documentId, cb) {
    this.request('GET', '/api/collaborators/document/' + documentId, null, cb)
  }

  /*
    Fetch all document resources
  */
  getDocumentResources(documentId, cb) {
    this.request('GET', '/api/entities/document/' + documentId, null, cb)
  }

  /*
    Get topics data
  */
  getTopics(cb) {
    this.request('GET', '/api/entities?filters=' + JSON.stringify({"entityType":"topic"}), null, cb)
  }

  /*
    Get collaborator data
  */
  getCollaborator(userId, cb) {
    this.request('GET', '/api/collaborators/' + userId, null, cb)
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

export default ResourceClient
