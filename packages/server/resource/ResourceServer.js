let ArchivistResourceServer = require('archivist-js').ResourceServer

/*
  ResourceServer module. Can be bound to an express instance
*/
class ResourceServer extends ArchivistResourceServer {

  bind(app) {
    // search
    app.get(this.path + '/entities/search/top', this._searchTopEntities.bind(this))
    app.get(this.path + '/entities/search/topics', this._searchTopics.bind(this))
    app.get(this.path + '/entities/locations', this._getLocationsList.bind(this))
    app.get(this.path + '/entities/main', this._getMainPageData.bind(this))
    app.get(this.path + '/entities/persons', this._getPersonsList.bind(this))
    super.bind(app)
    app.get(this.path + '/entities/persons/stats', this._getPersonsStats.bind(this))
    app.get(this.path + '/entities/facets/:type', this._getResourcesFacets.bind(this))
  }

  /*
    Get resources tree data for given entity type
  */
  _getResourcesTree(req, res, next) {
    let type = req.params.type

    this.engine.getResourcesTree(type)
      .then(function(entities) {
        res.json(entities)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get resources tree facets data for given entity type
  */
  _getResourcesFacets(req, res, next) {
    let type = req.params.type
    let filters = req.query.filters
    filters = filters ? JSON.parse(filters) : {}

    ///refs = refs ? JSON.parse(refs) : []

    this.engine.getResourcesFacets(filters, type)
      .then(function(entities) {
        res.json(entities)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get list of all locations as geoJSON
  */
  _getLocationsList(req, res, next) {
    this.engine.getLocationsList()
      .then(function(geojson) {
        res.json(geojson)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get list of all interviews locations and terms
  */
  _getMainPageData(req, res, next) {
    let data = {
      geo: {},
      topics: []
    }
    let filters = {"meta->>'state'": "published", topics: []}
    this.engine.getInterviewLocationsList()
      .then(geojson => {
        data.geo = geojson.features.map(f => {
          return {
            docs: f.properties.documents,
            point: f.geometry.coordinates,
            name: f.properties.name,
            entityId: f.properties.entityId
          }
        })
        return this.engine.getResourcesFacets(filters, 'topic')
      })
      .then(topics => {
        data.topics = topics
        res.json(data)
      })
      .catch(err => {
        next(err)
      })
  }

  /*
    Get list of all global persons
  */
  _getPersonsList(req, res, next) {
    let letter = req.query.letter
    let options = req.query.options
    options = options ? JSON.parse(options) : {}

    this.engine.getPersonsList(letter, options)
      .then(function(persons) {
        res.json(persons)
      })
      .catch(function(err) {
        next(err)
      })
  }


  /*
    Get list of person first letters with counters
  */
  _getPersonsStats(req, res, next) {
    this.engine.getPersonsStats()
      .then(function(stats) {
        res.json(stats)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get simple list of top search results
  */
  _searchTopEntities(req, res, next) {
    let args = req.query

    let search = "'" + args.query + "'"
    let language = "'" + args.language + "'"

    this.indexer.searchTopEntities(search, language)
      .then(function(resp) {
        res.json(resp)
      })
      .catch(function(err) {
        next(err)
      })
  }

  /*
    Get list of topics related to search query
  */
  _searchTopics(req, res, next) {
    let args = req.query

    let search = "'" + args.query + "'"
    let language = "'" + args.language + "'"

    this.indexer.searchTopics(search, language)
      .then(function(resp) {
        res.json(resp)
      })
      .catch(function(err) {
        next(err)
      })
  }
}

module.exports = ResourceServer
