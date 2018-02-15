const FileStore = require('./FileStore')

module.exports = {
  name: 'file-store',
  configure: function(config) {
    config.addStore('file', FileStore)
  }
}