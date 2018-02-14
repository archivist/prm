let ConverterServer = require('./ConverterServer')

module.exports = {
  name: 'converter-server',
  configure: function(config) {
    let server = config.getServerApp()

    let converterServer = new ConverterServer({
      path: '/api'
    })
    converterServer.bind(server)
  }
}
