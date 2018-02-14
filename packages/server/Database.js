let massive = require('massive')
let config = require('config')
let Promise = require('bluebird')

/*
  Implements Database Conection API.
*/
class Database {
  constructor(dbUrl) {
    this.db_url = dbUrl || config.get('db_url')
    this.connect()
  }

  /*
    Connect to the db
  */
  connect() {
    if (!this.db_url) {
      throw new Error('Could not find db connection string')
    }
    this.connection = massive.connectSync({connectionString: this.db_url})
  }

  /*
    Wipes DB and create tables
    Be careful with running this in production
    @returns {Promise}
  */
  reset() {
    return new Promise(function(resolve) {
      this.connection.reset(function(err) {
        if (err) {
          // eslint-disable-next-line
          console.error(err.stack)
          process.exit(1)
        }
        resolve()
      });
    }.bind(this))
  }

  /*
    Drop DB connection.
  */

  shutdown() {
    this.connection.end()
  }

}

module.exports = Database;
