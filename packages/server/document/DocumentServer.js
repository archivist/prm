let ArchivistDocumentServer = require('archivist-js').DocumentServer
let Promise = require('bluebird')
let each = require('lodash/each')

/*
  DocumentServer module. Can be bound to an express instance
*/
class OstDocumentServer extends ArchivistDocumentServer {
  bind(app) {
    super.bind(app)
    app.get(this.path + '/options/values', this._getMetaDataOptions.bind(this))
  }

  /*
    Get list of dictinct values for metadata property
  */
  _getMetaDataOptions(req, res, next) {
    let options = req.query.props
    options = options ? JSON.parse(options) : []

    return Promise.map(options, function(option) {
      return this.engine.getMetaDataOptions(option)
    }.bind(this), {concurrency: 10}).then(function(resp) {
      let result = {}
      each(options, (label, key) => {
        result[label] = resp[key]
      })
      res.json(result)
    }).catch(function(err) {
      next(err)
    })
  }




}

module.exports = OstDocumentServer
