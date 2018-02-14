let Err = require('substance').SubstanceError
let ArchivistIndexer = require('archivist-js').Indexer
let findIndex = require('lodash/findIndex')
let forEach = require('lodash/forEach')
let isEmpty = require('lodash/isEmpty')

// Massive internal libs
let massivePath = require.resolve('massive')
let ArgTypes = require(massivePath + '/../lib/arg_types')
let Where = require(massivePath + '/../lib/where')

class Indexer extends ArchivistIndexer {
  constructor(config) {
    super(config)

    this.resourceEngine = config.resourceEngine
  }

  searchDocuments(filters, options) {
    let isTextSearch = filters.query ? true : false
    let limit = options.limit || 100
    let offset = options.offset || 0
    let query, countQuery, args, where, searchQuery, language

    let topics = filters.topics ? filters.topics : []
    delete filters.topics
    if(!isEmpty(topics)) {
      filters['"references" ?&'] = topics
    }

    if(isTextSearch) {
      searchQuery = filters.query
      language = filters.language || 'english'
      delete filters.query
      delete filters.language

      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where ? where.where + ' \nAND (tsv @@ q)' : '\nWHERE (tsv @@ q)'
      let fragmentsWhereQuery = whereQuery

      // TODO: find a better solution
      // we don't want to count fts fragments inside topics fragments
      if(!isEmpty(topics)) fragmentsWhereQuery = whereQuery.replace('AND "references" ?& $2', '')

      countQuery = `SELECT COUNT(*) FROM documents, plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery}`

      query = `SELECT
"documentId", title, meta, "references",
(SELECT COUNT(*)
  FROM fragments ${fragmentsWhereQuery}
  AND "documentId" = documents."documentId"
) AS count,
ts_rank_cd(documents.tsv, q) AS rank FROM documents, plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery}
ORDER BY rank DESC limit ${limit} offset ${offset}`

    } else {
      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where

      countQuery = `SELECT COUNT(*) FROM documents ${whereQuery}`

      query = `SELECT
"documentId", title, meta, "references",
(SELECT COUNT(*)
  FROM fragments ${whereQuery}
  AND "documentId" = documents."documentId"
) AS count
FROM documents ${whereQuery}
ORDER BY count DESC limit ${limit} offset ${offset}`
    }

    return new Promise(function(resolve, reject) {
      this.db.run(countQuery, where.params, function(err, count) {
        if(err) {
          return reject(new Err('Indexer.SearchDocumentsError', {
            cause: err
          }))
        }

        let output = {
          total: count[0].count
        }

        this.db.run(query, where.params, function(err, res) {
          if(err) {
            return reject(new Err('Indexer.SearchDocumentsError', {
              cause: err
            }))
          }

          forEach(res, (doc, i) => {
            let docTopics = {}
            forEach(topics, topic => {
              docTopics[topic] = doc.references[topic]
            })
            res[i].topics = docTopics
            delete doc.references
          })

          let first = findIndex(res, function(doc) {
            return doc.count > 0
          })

          if(first > -1) {
            if(isTextSearch) {
              filters.query = searchQuery
              filters.language = language
            }
            filters["documentId"] = res[first]["documentId"]
            this.searchFragments(filters, options)
              .then(function(fragments) {
                res[first].fragments = fragments
                output.records = res
                resolve(output)
              })
              .catch(function() {
                output.records = res
                resolve(output)
              })
          } else {
            output.records = res
            resolve(output)
          }
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  searchFragments(filters, options) {
    let isTextSearch = filters.query ? true : false
    let limit = options.limit || 100
    let offset = options.offset || 0
    let query, args, where

    if(!isEmpty(filters.resources)) {
      filters['references ?&'] = filters.resources
      delete filters.resources
    } else {
      delete filters.resources
    }

    if(isTextSearch) {
      let searchQuery = filters.query
      let language = filters.language || 'english'
      delete filters.query
      delete filters.language

      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where ? where.where + ' \nAND (tsv @@ q)' : '\nWHERE (tsv @@ q)'

      query = `
        SELECT
        "fragmentId",
        ts_headline(${language}, content, q, 'StartSel=<strong>, StopSel=</strong>, HighlightAll=TRUE') as content,
        time
        FROM fragments,
        plainto_tsquery(${language}, ${searchQuery}) AS q ${whereQuery}
        ORDER BY SUBSTRING("fragmentId", '([0-9]+)')::int ASC limit ${limit} offset ${offset}
      `
    } else {
      args = ArgTypes.findArgs(arguments, this)
      where = isEmpty(args.conditions) ? {} : Where.forTable(args.conditions)

      let whereQuery = where.where

      query = `
        SELECT
        "fragmentId",
        content,
        time
        FROM fragments ${whereQuery}
        ORDER BY SUBSTRING("fragmentId", '([0-9]+)')::int ASC limit ${limit} offset ${offset}
      `
    }

    return new Promise(function(resolve, reject) {
      this.db.run(query, where.params, function(err, res) {
        if(err) {
          return reject(new Err('Indexer.SearchFragmentsError', {
            cause: err
          }))
        }

        resolve(res)
      })
    }.bind(this))
  }

  searchTopEntities(searchQuery, language) {
    let limit = 10
    language = language || 'russian'

    let query = `SELECT
      "entityId",
      name,
      (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") AS cnt,
      ts_rank_cd(entities.tsv, q) AS rank
      FROM entities,
      plainto_tsquery(${language}, ${searchQuery}) AS q
      WHERE ts_rank_cd(entities.tsv, q) >= 1 AND "entityType" != 'subject'
      ORDER BY rank DESC
      LIMIT ${limit}
    `

    return new Promise(function(resolve, reject) {
      this.db.run(query, function(err, res) {
        if(err) {
          return reject(new Err('Indexer.SearchTopEntitiesError', {
            cause: err
          }))
        }

        resolve(res)
      })
    }.bind(this))
  }

  searchTopics(searchQuery, language) {
    let limit = 30
    language = language || 'russian'

    let query = `SELECT
      "entityId",
      name,
      description,
      (SELECT COUNT(*) FROM documents WHERE "references" ? "entityId") AS cnt,
      ts_rank_cd(entities.tsv, q) AS rank
      FROM entities,
      plainto_tsquery(${language}, ${searchQuery}) AS q
      WHERE ts_rank_cd(entities.tsv, q) >= 1 AND "entityType" = 'subject'
      ORDER BY rank DESC
      LIMIT ${limit}
    `

    return new Promise(function(resolve, reject) {
      this.db.run(query, function(err, res) {
        if(err) {
          return reject(new Err('Indexer.SearchTopicsError', {
            cause: err
          }))
        }

        resolve(res)
      })
    }.bind(this))
  }

  _countEntityReferences(doc) {
    return new Promise((resolve) => {
      let entitiesIndex = doc.getIndex('entities')
      let annotations = []
      let references = {}
      forEach(entitiesIndex.byReference, (refs, key) => {
        annotations.push(key)
        references[key] = Object.keys(refs).length
      })

      resolve({
        annotations: annotations,
        references: references
      })
    })
  }
}

module.exports = Indexer
