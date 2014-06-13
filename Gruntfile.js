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
      example_https: {
        options: {
          base: ['example', 'example/build', 'build'],
          port:  3000,
          protocol: 'https',
          hostname: '*',
          cert: fs.readFileSync(__dirname + '/test/https_test_certs/server.crt').toString(),
          key:  fs.readFileSync(__dirname + '/test/https_test_certs/server.key').toString()
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
          'build/auth0-widget.js': ['standalone.js']
        }
      },
    },

    // uglify: {
    //   min: {
    //     files: {
    //       'build/auth0-widget.min.js': ['build/auth0-widget.js']
    //     }
    //   }
    // },
    less: {
      dist: {
        options: {
          paths: ["widget/css"],
        },
        files: {
          "widget/css/main.css": "widget/css/main.less",
          "widget/css/zocial.css": "widget/css/zocial.less"
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
        src:  'widget/css/main.css',
        dest: 'widget/css/main.css',
      },
    },
    prefix: { //this adds "a0-" to every class and id
      css: {
        src: 'widget/css/main.css',
        dest: 'widget/css/main.css',
        prefix: 'a0-'
      }
    },
    cssmin: {
      minify: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'widget/css/main.min.css': ['widget/css/main.css'],
          'widget/css/zocial.min.css': ['widget/css/zocial.css']
        }
      }
    },
    copy: {
      example: {
        files: {
          'example/auth0-widget.min.js': 'build/auth0-widget.min.js',
          'example/auth0-widget.js':     'build/auth0-widget.js'
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
        cmd: 'node_modules/.bin/uglifyjs build/auth0-widget.js  -b beautify=false,ascii_only=true > build/auth0-widget.min.js',
        stdout: true,
        stderr: true
      },
      'test-phantom': {
        cmd: 'testem -f testem_dev.yml ci -l PhantomJS',
        stdout: true,
        stderr: true
      },
      'test-ie': {
        cmd: 'testem ci -l bs_ie_8,bs_ie_9,bs_ie_10', //disable ,bs_ie_8 is not working
        stdout: true,
        stderr: true
      },
      'test-desktop': {
        cmd: 'testem ci -l bs_chrome,bs_firefox', //disable ,bs_ie_9,bs_ie_10,bs_ie_8 Browserstack is not working
        stdout: true,
        stderr: true
      },
      'test-mobile': {
        cmd: 'testem ci -l bs_iphone_5', //disable ,bs_android_41: is not working
        stdout: true,
        stderr: true
      }
    },
    clean: {
      build: ["release/", "build/", "widget/css/main.css", "widget/css/main.min.css", "widget/css/zocial.css", "widget/css/zocial.min.css", "example/auth0-widget.js"]
    },
    watch: {
      another: {
        files: ['node_modules',
                'standalone.js',
                'widget/**/*',
                'i18n/*'],
        tasks: ['build']
      },
      example: {
        files: ['example/*'],
        tasks: ["less:example"]
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
          { src:     'w2/auth0-widget-' + pkg.version + '.js', },
          { src:     'w2/auth0-widget-' + pkg.version + '.min.js', },
          { src:     'w2/auth0-widget-' + major_version + '.js', },
          { src:     'w2/auth0-widget-' + major_version + '.min.js', },
          { src:     'w2/auth0-widget-' + minor_version + '.js', },
          { src:     'w2/auth0-widget-' + minor_version + '.min.js', }
        ]
      },
      publish: {
        upload: [
          {
            src:     'release/*',
            dest:    'w2/',
            options: { gzip: false }
          }
        ]
      }
    },
    /* Check if the repository is clean after build. If the version found in the build folder was not updated
     * this will make the build fail. */
    checkrepo: {
      cdn: {
        clean: true
      }
    },
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
          { dest:     'w2/auth0-widget-' + pkg.version + '.js', },
          { dest:     'w2/auth0-widget-' + pkg.version + '.min.js', },
          { dest:     'w2/auth0-widget-' + major_version + '.js', },
          { dest:     'w2/auth0-widget-' + major_version + '.min.js', },
          { dest:     'w2/auth0-widget-' + minor_version + '.js', },
          { dest:     'w2/auth0-widget-' + minor_version + '.min.js', }
        ],
      },
    }
  });

  grunt.registerMultiTask('prefix', 'Prefix css.', function() {
    var css = fs.readFileSync(__dirname + '/' + this.data.src, 'utf8');
    var prefixed = cssPrefix(this.data.prefix, css.toString());
    fs.writeFileSync(__dirname + '/' + this.data.dest, prefixed);
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",         ["clean", "less:dist", "prefix:css", "autoprefixer:main", "cssmin:minify",
                                       "browserify:debug", "exec:uglify"]);
  grunt.registerTask("example",       ["less:example", "connect:example", "build", "watch"]);
  grunt.registerTask("example_https", ["less:example", "connect:example_https", "build", "watch"]);
  grunt.registerTask("dev",           ["connect:test", "build", "watch"]);
  grunt.registerTask("test",          ["build", "exec:test-phantom"]);
  grunt.registerTask("integration",   ["exec:test-desktop", "exec:test-mobile"]);
  grunt.registerTask("cdn",           ["build", "copy:release", "checkrepo", "s3:clean", "s3:publish", "maxcdn:purgeCache"]);
};
