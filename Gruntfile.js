module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      example: {
        options: {
          base: 'example',
          port: 3000
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'build/auth0-widget.js': ['index.js']
        }
      }
    },
    uglify: {
      min: {
        files: {
          'build/auth0-widget.min.js': ['build/auth0-widget.js']
        }
      }
    },
    copy: {
      example: {
        files: {
          'example/auth0-widget.js': 'build/auth0-widget.js'
        }
      }
    },
    clean: {
      build: ["build/", "example/auth0-widget.js"],
    },
    watch: {
      another: {
        files: ['node_modules', 'index.js', 'widget/*.js'],
        tasks: ['build']
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",   ["clean", "browserify:dist", "uglify:min", "copy:example"]);
  grunt.registerTask("example", ["connect:example", "build", "watch"]);
};
