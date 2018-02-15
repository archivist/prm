let fs = require('fs')
let sharp = require('sharp')
let Promise = require('bluebird')
let Err = require('substance').SubstanceError

/*
  FileServer module. Can be bound to an express instance
*/
class FileServer {
  constructor(config) {
    this.path = config.path
    this.store = config.store
    this.authEngine = config.authEngine
    this.localPath = config.filePath
  }

  bind(app) {
    //app.get(this.path + '/rebuild', this._rebuildThumbs.bind(this))
    app.post(this.path, this.authEngine.hasAccess.bind(this.authEngine), this._uploadFile.bind(this))
    app.delete(this.path + '/:id', this.authEngine.hasAccess.bind(this.authEngine), this._removeFile.bind(this))
  }

  _uploadFile(req, res, next) {
    let uploader = this.store.getFileUploader('files')
    uploader(req, res, (err) => {
      if (err) {
        return next(new Err('FileStore.UploadError', {
          cause: err
        }))
      }
      if(req.file.mimetype.indexOf('image') > -1) {
        Promise.all([
          this._resize200(req),
          this._resize400(req)
        ]).then(() => {
          res.json({name: this.store.getFileName(req)})
        }).catch(function(err) {
          return next(err)
        })
      } else {
        res.json({name: this.store.getFileName(req)})
      }
    })
  }

  _rebuildThumbs(req, res, next) {
    fs.readdir('./media/', (err, files) => {
      if(err) return next(err)
      Promise.map(files, file => {
        const isFile = fs.lstatSync('./media/' + file).isFile()
        if(isFile) {
          const opt = {
            file: {
              destination: this.localPath + '/',
              filename: file,
              path: this.localPath + '/' + file
            }
          }
          return Promise.all([
            this._resize200(opt),
            this._resize400(opt)
          ])
        } else {
          return false
        }
      })
    })
  }

  _resize200(req) {
    return new Promise((resolve, reject) => {
      sharp(req.file.path)
        .resize(200, 200)
        .toFile(req.file.destination + '/s200/' + req.file.filename, err => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
    })
  }

  _resize400(req) {
    return new Promise((resolve, reject) => {
      sharp(req.file.path)
        .resize(400, 400)
        .max()
        .toFile(req.file.destination + '/s400/' + req.file.filename, err => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
    })
  }

  _removeFile(req, res, next) {
    let fileName = req.params.id
    return this.store.deleteFile(fileName, err => {
      if(err) return next(err)
      res.sendStatus(200)
    })
  }
}

module.exports = FileServer
