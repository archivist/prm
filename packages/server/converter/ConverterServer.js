let spawn = require('child_process').spawn

/*
  ConverterServer module. Can be bound to an express instance
*/
class ConverterServer {

  constructor(config) {
    this.path = config.path
  }

  bind(app) {
    //app.get(this.path + '/convert', this._convert.bind(this))
  }

  _convert(req, res, next) {
    res.send('<p>Current data will be converted in couple of minutes...</p>')
    let converter = spawn('../convert.sh')

    converter.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    })
    converter.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    })
    converter.on('close', function(code) {
      console.log('closing code: ' + code);
    })

    process.on('SIGINT', function () {
      converter.kill()
      process.exit()
    })
  }
}

module.exports = ConverterServer
