let FileServer = require('./FileServer')

module.exports = {
  name: 'file-server',
  configure: function(config) {
    let server = config.getServerApp()
    let authEngine = config.getEngine('auth')

    let fileServer = new FileServer({
      authEngine: authEngine,
      store: config.getStore('file'),
      filePath: server.mediaPath,
      path: '/api/media'
    })
    fileServer.bind(server)
  }
}
