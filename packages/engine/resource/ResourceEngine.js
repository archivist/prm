let Err = require('substance').SubstanceError
let ArchivistResourceEngine = require('archivist-js').ResourceEngine
let each = require('lodash/each')
let isEmpty = require('lodash/isEmpty')
let isNull = require('lodash/isNull')
let isUndefined = require('lodash/isUndefined')
let Promise = require('bluebird')

let massivePath = require.resolve('massive')
// Massive internal libs
let ArgTypes = require(massivePath + '/../lib/arg_types')
let Where = require(massivePath + '/../lib/where')

class ResourceEngine extends ArchivistResourceEngine {

  getResourcesFacets(filters, entityType) {
    if(filters.topics) {
      filters['"references" ?&'] = filters.topics
      delete filters.topics
    }

    let whereSearch
    if(filters.query) {
      let searchQuery = filters.query
      let language = filters.language || 'english'
      whereSearch = `tsv @@ plainto_tsquery('${language}', '${searchQuery}')`
      delete filters.query
      delete filters.language
    }

    let args = ArgTypes.findArgs(arguments, this)
    let where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

    let whereQuery = where.where ? where.where : ''
    if(whereSearch) {
      whereQuery += whereQuery ? ' \nAND ' + whereSearch : ' \nWHERE ' + whereSearch
    }

    let query = `
      SELECT "entityId", entities.name, cnt FROM (
        SELECT DISTINCT
          jsonb_object_keys(documents.references) AS anno,
          COUNT(*) OVER (PARTITION BY jsonb_object_keys(documents.references)) cnt
        FROM documents ${whereQuery}
      ) AS docs INNER JOIN entities ON (docs.anno = entities."entityId")
      WHERE "entityType" = '${entityType}'
      ORDER BY entities.name ASC
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, where.params, (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetResourcesTree', {
            cause: err
          }))
        }

        resolve(entities)
      })
    })
  }

  getLocationsList() {
    let query = `
      SELECT "entityId", name, "entityType", data,
      (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") AS cnt,
      (SELECT COUNT(*) FROM documents WHERE meta->>'interview_location' = "entityId" AND meta->>'state' = 'published') AS docs,
      (SELECT SUM(("references"->"entityId")::text::integer) FROM documents WHERE "references" ? "entityId") AS sum
      FROM entities
      WHERE "entityType" = 'geofeature' AND (data->>'point' != '{}')
      AND (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId" OR meta->>'interview_location' = "entityId") > 0
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetLocationsList', {
            cause: err
          }))
        }

        let geojson = {
          type: "FeatureCollection",
          features: []
        }
        each(entities, function(entity) {
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": entity.data.point
            },
            "properties": entity.data
          }
          feature.properties.entityId = entity.entityId
          feature.properties.documents = parseInt(entity.cnt) > 0 ? entity.cnt : entity.docs
          feature.properties.fragments = entity.sum || 0

          if(!isNull(entity.data.point) && entity.data.point.length > 0) geojson.features.push(feature)
        })

        resolve(geojson)
      })
    })
  }

  getInterviewLocationsList() {
    let query = `
      SELECT "entityId", name, "entityType", data,
      (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") AS cnt,
      (SELECT COUNT(*) FROM documents WHERE meta->>'interview_location' = "entityId" AND meta->>'state' = 'published') AS docs,
      (SELECT SUM(("references"->"entityId")::text::integer) FROM documents WHERE "references" ? "entityId") AS sum
      FROM entities
      WHERE "entityType" = 'geofeature' AND data->>'point' != '{}' AND data->'featureType' ? 'место взятия интервью'
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, (err, entities) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetLocationsList', {
            cause: err
          }))
        }

        let geojson = {
          type: "FeatureCollection",
          features: []
        }
        let counter = 0
        each(entities, function(entity) {
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": entity.data.point
            },
            "properties": entity.data
          }
          feature.properties.entityId = entity.entityId
          feature.properties.documents = entity.docs
          feature.properties.fragments = entity.sum
          if(!isNull(entity.data.point) && entity.data.point.length > 0 && entity.docs > 0) {
            geojson.features.push(feature)
          }
        })
        console.log(counter)
        resolve(geojson)
      })
    })
  }

  getPersonsList(letter, options) {
    let offset = options.offset || 0
    let limit = options.limit || 100

    let letterCondition = ''
    if(letter !== 'undefined') letterCondition = 'AND lower(LEFT(name, 1)) = \'' + letter + '\''

    let countQuery = `
      SELECT COUNT(*)
      FROM entities
      WHERE "entityType" = 'person'
      AND entities.data->'global' = 'true' ${letterCondition}
    `

    let query = `
      SELECT "entityId", name, description,
      (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId" AND meta->>'state' = 'published') AS count,
      (SELECT SUM(("references"->"entityId")::text::integer) FROM documents WHERE "references" ? "entityId" AND meta->>'state' = 'published') AS fragments
      FROM entities
      WHERE "entityType" = 'person'
      AND entities.data->'global' = 'true' ${letterCondition}
      AND (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") > 0
      ORDER BY name ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    return new Promise((resolve, reject) => {
      this.db.run(countQuery, (err, count) => {
        if (err) {
          return reject(new Err('ResourceEngine.CountPersonsList', {
            cause: err
          }))
        }

        this.db.run(query, (err, entities) => {
          if (err) {
            return reject(new Err('ResourceEngine.GetPersonsList', {
              cause: err
            }))
          }

          let results = {
            total: count[0].count,
            records: entities
          }

          resolve(results)
        })
      })
    })
  }

  getPersonsStats() {
    let query = `
      SELECT lower(LEFT(name, 1)) AS letter, COUNT(*) AS cnt
      FROM entities
      WHERE "entityType" = 'person'
      AND data->>'global' = 'true'
      AND (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") > 0
      GROUP BY letter
    `

    return new Promise((resolve, reject) => {
      this.db.run(query, (err, stats) => {
        if (err) {
          return reject(new Err('ResourceEngine.GetPersonsList', {
            cause: err
          }))
        }

        resolve(stats)
      })
    })
  }
}

module.exports = ResourceEngine
