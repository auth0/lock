var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          base: "test",
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
          transform: ['browserify-ejs', 'brfs'],
          debug: false
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
          'example/auth0-widget.js':  'build/auth0-widget.js',
          'test/auth0-widget.js':     'build/auth0-widget.js'
        }
      }
    },
    clean: {
      build: ["build/", "widget/css/main.css", "example/auth0-widget.js"]
    },
    watch: {
      another: {
        files: ['node_modules', 'standalone.js', 'widget/index.js', 'widget/html/*.html', 'widget/js/*.js', 'widget/css/*.less', 'widget/css/themes/*.less'],
        tasks: ['build']
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",         ["clean", "less:dist", "browserify:dist", "uglify:min", "copy:example"]);
  grunt.registerTask("example",       ["connect:example", "build", "watch"]);
  grunt.registerTask("example_https", ["connect:example_https", "build", "watch"]);
  grunt.registerTask("dev",           ["connect:test", "build", "watch"]);
};
