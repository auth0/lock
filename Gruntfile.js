var fs = require('fs');
var pkg = require('./package');

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          // base: "test",
          hostname: '0.0.0.0',
          port: 9999
        }
      },
      example: {
        options: {
          base: 'example',
          port: 3000
        }
      },
      example_https: {
        options: {
          base:  "example",
          port:  3000,
          protocol: 'https',
          hostname: '*',
          cert: fs.readFileSync(__dirname + '/https_test_certs/server.crt').toString(),
          key:  fs.readFileSync(__dirname + '/https_test_certs/server.key').toString()
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'build/auth0-widget.js': ['widget/js/placeholders.js', 'standalone.js']
        },
        options: {
          transform: ['ejsify', 'brfs'],
          debug: false
        }
      },
      debug: {
        files: {
          'build/auth0-widget.debug.js': ['widget/js/placeholders.js', 'standalone.js']
        },
        options: {
          transform: ['ejsify', 'brfs'],
          debug: true
        }
      },
    },
    uglify: {
      min: {
        files: {
          'build/auth0-widget.min.js': ['build/auth0-widget.js']
        }
      }
    },
    less: {
      dist: {
        options: {
          paths: ["widget/css"],
          yuicompress: true
        },
        files: {
          "widget/css/main.css": "widget/css/main.less"
        }
      }
    },
    copy: {
      example: {
        files: {
          'example/auth0-widget.js':  'build/auth0-widget.debug.js',
        }
      }
    },
    exec: {
      'test-phantom': {
        cmd: 'testem -f testem_dev.yml ci -l PhantomJS',
        stdout: true,
        stderr: true
      },
      'test-desktop': {
        cmd: 'testem ci -l bs_chrome,bs_firefox,bs_ie_9,bs_ie_10', //disable ,bs_ie_8 is not working
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
      build: ["build/", "widget/css/main.css", "example/auth0-widget.js"]
    },
    watch: {
      another: {
        files: ['node_modules',
                'standalone.js',
                'widget/index.js',
                'widget/html/**',
                'widget/js/*.js',
                'widget/css/*.less',
                'widget/css/themes/*.less',
                'i18n/*'],
        tasks: ['build']
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
        }
      },
      publish: {
        upload: [
          {
            src:  'build/auth0-widget.min.js',
            dest: 'w2/auth0-widget-' + pkg.version + '.min.js',
            options: { gzip: true }
          },
          {
            src:  'build/auth0-widget.debug.js',
            dest: 'w2/auth0-widget-' + pkg.version + '.js'
          },
        ]
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",         ["clean", "less:dist", "browserify:dist", "browserify:debug", "uglify:min", "copy:example"]);
  grunt.registerTask("example",       ["connect:example", "build", "watch"]);
  grunt.registerTask("example_https", ["connect:example_https", "build", "watch"]);
  grunt.registerTask("dev",           ["connect:test", "build", "watch"]);
  grunt.registerTask("test",          ["exec:test-phantom"]);
  grunt.registerTask("integration",   ["exec:test-desktop", "exec:test-mobile"]);
  grunt.registerTask("cdn",           ["build", "s3"]);
};
