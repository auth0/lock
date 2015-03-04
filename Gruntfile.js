var fs = require('fs');
var path = require('path');
var pkg = require('./package');
var cssPrefix = require('css-prefix');

var minor_version = pkg.version.replace(/\.(\d)*$/, '');
var major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, '');
var path = require('path');

function  rename_release (v) {
  return function (d, f) {
    var dest = path.join(d, f.replace(/(\.min)?\.js$/, '-'+ v + '$1.js').replace('auth0-', ''));
    return dest;
  };
}

function node_bin (bin) {
  return path.join('node_modules', '.bin', bin);
}

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          // base: 'test',
          hostname: '*',
          base: ['.', 'example', 'example/build', 'build'],
          port: 9999
        }
      },
      example: {
        options: {
          hostname: '*',
          base: ['example', 'example/build', 'build'],
          port: 3000
        }
      },
      'example-https': {
        options: {
          base: ['example', 'example/build', 'build'],
          port:  3000,
          protocol: 'https',
          hostname: '*',
          cert: fs.readFileSync(__dirname + '/test/support/https-certs/server.crt').toString(),
          key:  fs.readFileSync(__dirname + '/test/support/https-certs/server.key').toString()
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        watch: true,

        // Convert absolute sourcemap filepaths to relative ones using mold-source-map.
        postBundleCB: function(err, src, cb) {
          if (err) { return cb(err); }
          var through = require('through');
          var stream = through().pause().queue(src).end();
          var buffer = '';

          stream.pipe(require('mold-source-map').transformSourcesRelativeTo(__dirname)).pipe(through(function(chunk) {
            buffer += chunk.toString();
          }, function() {
            cb(err, buffer);
          }));
          stream.resume();
        }

      },
      debug: {
        files: {
          'build/auth0-lock.js': ['standalone.js']
        }
      },
    },
    less: {
      dist: {
        options: {
          paths: ['lib/css'],
        },
        files: {
          'lib/css/main.css': 'lib/css/main.less'
        }
      },
      example: {
        files: {
          'example/build/index.css': 'example/index.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'ff 15', 'opera 12.1', 'ie 8']
      },
      main: {
        src:  'lib/css/main.css',
        dest: 'lib/css/main.css',
      },
    },
    prefix: { //this adds 'a0-' to every class and id
      css: {
        src: 'lib/css/main.css',
        dest: 'lib/css/main.css',
        prefix: 'a0-'
      }
    },
    cssmin: {
      minify: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'lib/css/main.min.css': ['lib/css/main.css']
        }
      }
    },
    copy: {
      example: {
        files: {
          'example/auth0-lock.min.js': 'build/auth0-lock.min.js',
          'example/auth0-lock.js':     'build/auth0-lock.js'
        }
      },
      release: {
        files: [
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(pkg.version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(minor_version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(major_version) }
        ]
      }
    },
    exec: {
      'uglify': {
        cmd: node_bin('uglifyjs') + ' build/auth0-lock.js  -b beautify=false,ascii_only=true > build/auth0-lock.min.js',
        stdout: true,
        stderr: true
      },
      'test-inception': {
        cmd: node_bin('mocha') + ' ./test/support/characters-inception.test.js',
        stdout: true,
        stderr: true
      },
      'test-integration': {
        cmd: node_bin('zuul') + ' -- test/*.js',
        stdout: true,
        stderr: true
      },
      'test-phantom': {
        cmd: node_bin('zuul') + ' --ui mocha-bdd --disable-tunnel --phantom 9999 -- test/*.js',
        stdout: true,
        stderr: true
      }
    },
    clean: {
      css: ['lib/css/main.css', 'lib/css/main.min.css'],
      js: ['release/', 'build/', 'example/auth0-lock.js']
    },
    watch: {
      js: {
        files: ['build/auth0-lock.js'],
        tasks: [],
        options: {
          livereload: true
        },
      },
      css: {
        files: [
          'lib/**/*.less'
        ],
        tasks: ['build'],
        options: {
          livereload: true
        },
      },
      example: {
        files: ['example/*'],
        tasks: ['less:example'],
        options: {
          livereload: true
        },
      }
    },
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        uploadConcurrency: 5,
        params: {
          CacheControl: 'public, max-age=300'
        },
        // debug: true <<< use this option to test changes
      },
      clean: {
        files: [
          { action: 'delete', dest: 'js/lock-' + pkg.version + '.js' },
          { action: 'delete', dest: 'js/lock-' + pkg.version + '.min.js' },
          { action: 'delete', dest: 'js/lock-' + major_version + '.js' },
          { action: 'delete', dest: 'js/lock-' + major_version + '.min.js' },
          { action: 'delete', dest: 'js/lock-' + minor_version + '.js' },
          { action: 'delete', dest: 'js/lock-' + minor_version + '.min.js' }
        ]
      },
      publish: {
        files: [
          {
            expand: true,
            cwd:    'release/',
            src:    ['**'],
            dest:   'js/'
          }
        ]
      }
    },
    /* Checks for outdated npm dependencies before release. */
    outdated: {
      release: {
        development: false
      }
    },
    /* Purge FASTLY cache. */
    fastly: {
      options: {
        key:  process.env.FASTLY_KEY,
        host: process.env.FASTLY_HOST
      },
      purge: {
        options: {
          urls: [
            'js/lock-' + pkg.version + '.js',
            'js/lock-' + pkg.version + '.min.js',
            'js/lock-' + major_version + '.js',
            'js/lock-' + major_version + '.min.js',
            'js/lock-' + minor_version + '.js',
            'js/lock-' + minor_version + '.min.js',
          ]
        },
      },
    },
    http: {
      purge_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + pkg.version + '.js',
          method: 'DELETE'
        }
      },
      purge_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + pkg.version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_major_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + major_version + '.js',
          method: 'DELETE'
        }
      },
      purge_major_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + major_version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_minor_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + minor_version + '.js',
          method: 'DELETE'
        }
      },
      purge_minor_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/lock-' + minor_version + '.min.js',
          method: 'DELETE'
        }
      }
    }
  });

  grunt.registerMultiTask('prefix', 'Prefix css.', function() {
    var done = this.async();
    var that = this;
    fs.readFile(__dirname + '/' + this.data.src, {encoding: 'utf8'}, function (err, data) {
      if (err) { return done(err);  }
      var prefixed = cssPrefix(that.data.prefix, data.toString());
      fs.writeFile(__dirname + '/' + that.data.dest, prefixed, function (err) {
        if (err) { return done(err); }
        done();
      });
    });
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) { grunt.loadNpmTasks(key); }
  }

  grunt.registerTask('css',           ['clean:css', 'less:dist', 'prefix:css', 'autoprefixer:main', 'cssmin:minify']);

  grunt.registerTask('js',            ['clean:js', 'browserify:debug', 'exec:uglify']);
  grunt.registerTask('build',         ['css', 'js']);

  grunt.registerTask('example',       ['less:example', 'connect:example', 'build', 'watch']);
  grunt.registerTask('example-https', ['less:example', 'connect:example-https', 'build', 'watch']);

  grunt.registerTask('dev',           ['connect:test', 'build', 'watch']);
  grunt.registerTask('integration',   ['exec:test-inception', 'exec:test-integration']);
  grunt.registerTask('phantom',       ['build', 'exec:test-inception', 'exec:test-phantom']);

  grunt.registerTask('purge_cdn',     ['http:purge_js', 'http:purge_js_min', 'http:purge_major_js', 'http:purge_major_js_min', 'http:purge_minor_js', 'http:purge_minor_js_min']);

  grunt.registerTask('cdn',           ['build', 'copy:release', 'aws_s3:clean', 'aws_s3:publish', 'purge_cdn']);
};
