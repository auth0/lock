var fs = require('fs');
var pkg = require('./package');
var cssPrefix = require('css-prefix');

var minor_version = pkg.version.replace(/\.(\d)*$/, '');
var major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, '');
var path = require('path');

function  rename_release (v) {
  return function (d, f) {
    var dest = path.join(d, f.replace(/(\.min)?\.js$/, '-'+ v + "$1.js"));
    return dest;
  };
}

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          // base: "test",
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
      "example-https": {
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
        bundleOptions: {
          debug: true
        },

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

    // uglify: {
    //   min: {
    //     files: {
    //       'build/auth0-lock.min.js': ['build/auth0-lock.js']
    //     }
    //   }
    // },
    less: {
      dist: {
        options: {
          paths: ["lib/css"],
        },
        files: {
          "lib/css/main.css": "lib/css/main.less"
        }
      },
      example: {
        files: {
          "example/build/index.css": "example/index.less"
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
    prefix: { //this adds "a0-" to every class and id
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
        cmd: 'node_modules/.bin/uglifyjs build/auth0-lock.js  -b beautify=false,ascii_only=true > build/auth0-lock.min.js',
        stdout: true,
        stderr: true
      },
      'test-integration': {
        cmd: 'node_modules/.bin/zuul -- test/*.js',
        stdout: true,
        stderr: true
      },
      'test-phantom': {
        cmd: 'node_modules/.bin/zuul --ui mocha-bdd --phantom 9999 -- test/*.js',
        stdout: true,
        stderr: true
      }
    },
    clean: {
      build: ["release/", "build/", "lib/css/main.css", "lib/css/main.min.css", "example/auth0-lock.js"]
    },
    watch: {
      another: {
        files: ['node_modules',
                'standalone.js',
                'index.js',
                'lib/**/*',
                'i18n/*'],
        tasks: ['build'],
        options: {
          livereload: true
        },
      },
      example: {
        files: ['example/*'],
        tasks: ["less:example"],
        options: {
          livereload: true
        },
      }
    },
    s3: {
      options: {
        key:    process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        bucket: process.env.S3_BUCKET,
        access: 'public-read',
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/javascript; charset=UTF-8'
        }
      },
      clean: {
        del: [
          { src: 'js/lock-' + pkg.version + '.js' },
          { src: 'js/lock-' + pkg.version + '.min.js' },
          { src: 'js/lock-' + major_version + '.js' },
          { src: 'js/lock-' + major_version + '.min.js' },
          { src: 'js/lock-' + minor_version + '.js' },
          { src: 'js/lock-' + minor_version + '.min.js' }
        ]
      },
      publish: {
        upload: [
          {
            src: 'release/auth0-lock-' +  pkg.version + '.js',
            dest: 'js/lock-' + pkg.version + '.js',
            gzip: false
          },
          {
            src: 'release/auth0-lock-' +  pkg.version + '.min.js',
            dest: 'js/lock-' + pkg.version + '.min.js',
            gzip: false
          },
          {
            src: 'release/auth0-lock-' +  minor_version + '.js',
            dest: 'js/lock-' + minor_version + '.js',
            gzip: false
          },
          {
            src: 'release/auth0-lock-' +  minor_version + '.min.js',
            dest: 'js/lock-' + minor_version + '.min.js',
            gzip: false
          },
          {
            src: 'release/auth0-lock-' +  major_version + '.js',
            dest: 'js/lock-' + major_version + '.js',
            gzip: false
          },
          {
            src: 'release/auth0-lock-' +  major_version + '.min.js',
            dest: 'js/lock-' + major_version + '.min.js',
            gzip: false
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
    /* Purge MAXCDN cache. */
    maxcdn: {
      purgeCache: {
        options: {
          companyAlias:   process.env.MAXCDN_COMPANY_ALIAS,
          consumerKey:    process.env.MAXCDN_CONSUMER_KEY,
          consumerSecret: process.env.MAXCDN_CONSUMER_SECRET,
          zone_id:        process.env.MAXCDN_ZONE_ID,
          method:         'delete'
        },
        files: [
          { dest: 'js/lock-' + pkg.version + '.js' },
          { dest: 'js/lock-' + pkg.version + '.min.js' },
          { dest: 'js/lock-' + major_version + '.js' },
          { dest: 'js/lock-' + major_version + '.min.js' },
          { dest: 'js/lock-' + minor_version + '.js' },
          { dest: 'js/lock-' + minor_version + '.min.js' }
        ],
      },
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
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",         ["clean", "less:dist", "prefix:css", "autoprefixer:main", "cssmin:minify", "browserify:debug", "exec:uglify"]);
  grunt.registerTask("example",       ["less:example", "connect:example", "build", "watch"]);
  grunt.registerTask("example-https", ["less:example", "connect:example-https", "build", "watch"]);

  grunt.registerTask("dev",           ["connect:test", "build", "watch"]);
  grunt.registerTask("integration",   ["exec:test-integration"]);
  grunt.registerTask("phantom",       ["exec:test-phantom"]);

  grunt.registerTask("cdn",           ["build", "copy:release", "s3:clean", "s3:publish", "maxcdn:purgeCache"]);
};
