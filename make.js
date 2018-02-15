const b = require('substance-bundler')
const fs = require('fs')
const config = require('config')

b.task('clean', function() {
  b.rm('./dist')
})
// copy assets
b.task('assets', function() {
  b.copy('node_modules/font-awesome', './dist/libs/font-awesome')
  b.copy('node_modules/leaflet.markercluster/dist', './dist/libs/markercluster')
  b.copy('node_modules/leaflet/dist/images', './dist/publisher/images')
  b.copy('node_modules/leaflet-control-geocoder/dist/images', './dist/publisher/images')
})
// dev
b.task('publisher', buildApp('publisher'))
b.task('scholar', buildApp('scholar'))
// production
b.task('publisher-min', buildApp('publisher', true))
b.task('scholar-min', buildApp('scholar', true))
// build apps
b.task('client', ['publisher', 'scholar'])
b.task('client-min', ['scholar-min', 'publisher-min'])
// build libraries
b.task('deps', () => {
  _buildDeps()
})
b.task('deps-min', () => {
  _buildDeps(true)
})
// build server js
b.task('server', () => {
  buildServerJS()
})

// build all
b.task('default', ['dev'])
b.task('dev', ['clean', 'assets', 'deps', 'server', 'client'])
b.task('production', ['clean', 'assets', 'deps-min', 'server', 'client-min'])

function buildApp(app, production) {
  return function() {
    if(production) {
      b.copy('client/'+ app +'/index.production.html', './dist/'+ app +'/index.html')
    } else {
      b.copy('client/'+ app +'/index.html', './dist/'+ app +'/')
    }
    b.copy('client/'+ app +'/assets', './dist/'+ app +'/assets/')
    b.css('client/' + app + '/app.css', 'dist/' + app + '/' + app + '.css')

    b.js('client/' + app + '/app.js', {
      targets: [{
        dest: './dist/' + app + '/app.js',
        format: 'umd', moduleName: 'app'
      }],
      commonjs: {
        include: [
          'node_modules/moment/moment.js',
          'node_modules/plyr/src/js/plyr.js',
          'node_modules/leaflet/dist/leaflet-src.js',
          'node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js',
          'node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js',
          'node_modules/dropzone/dist/dropzone.js'
        ]
      },
      external: ['substance', 'archivist'],
      globals: {
        'substance': 'substance',
        'archivist-js': 'archivist-js'
      },
      buble: production === true,
      useStrict: production !== true
    })

    b.custom('injecting config', {
      src: './dist/' + app + '/app.js',
      dest: './dist/' + app + '/' + app + '.js',
      execute: function(file) {
        const code = fs.readFileSync(file[0], 'utf8')
        const result = code.replace(/ARCHIVISTCONFIG/g, JSON.stringify(config.get('app')))
        fs.writeFileSync(this.outputs[0], result, 'utf8')
      }
    })
    if(production) {
      b.minify('./dist/' + app + '/' + app + '.js')
    } else {
      b.copy('./dist/' + app + '/app.js.map', './dist/' + app + '/' + app + '.js.map')
    }
    b.rm('./dist/' + app + '/app.js')
    b.rm('./dist/' + app + '/app.js.map')
  }
}

function buildServerJS() {
  b.js('./index.es.js', {
    external: ['substance', 'archivist-js'],
    globals: {
      'substance': 'substance',
      'archivist-js': 'archivist-js'
    },
    targets: [{
      dest: 'dist/prm.cjs.js',
      format: 'cjs'
    }]
  })
}

/* HELPERS */

function _buildDeps(min) {
  b.copy('node_modules/substance/dist', './dist/libs/substance')
  if(min) {
    b.minify('./dist/libs/substance/substance.js', './dist/libs/substance/substance.min.js')
    b.custom('applying modification', {
      src: './dist/libs/substance/substance.es5.js',
      dest: './dist/libs/substance/substance.legacy.js',
      execute: function(file) {
        const code = fs.readFileSync(file[0], 'utf8')
        const result = code.replace(/(\(ref = this\)._initialize.apply\(ref, args\);)[\s\S]{13}/g, 'var ref;(ref = this)._initialize.apply(ref, args);')
        fs.writeFileSync(this.outputs[0], result, 'utf8')
      }
    })

    b.minify('./dist/libs/substance/substance.legacy.js')
  }

  b.copy('node_modules/archivist-js/dist', './dist/libs/archivist')
  if(min) {
    b.minify('./dist/libs/archivist/archivist.js', './dist/libs/archivist/archivist.min.js')
    b.minify('./dist/libs/archivist/archivist.es5.js')
  }
}
