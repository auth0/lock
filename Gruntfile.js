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
        },
        options: {
          transform: ['browserify-ejs', 'brfs'],
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
          'example/auth0-widget.js': 'build/auth0-widget.js',
          'example/img/close.png': 'widget/img/close.png',
          'example/img/logo-32.png': 'widget/img/logo-32.png',
          'example/img/spinner.gif': 'widget/img/spinner.gif',
          'example/font/zocial-regular-webfont.dev.svg': 'widget/font/zocial-regular-webfont.dev.svg',
          'example/font/zocial-regular-webfont.eot': 'widget/font/zocial-regular-webfont.eot',
          'example/font/zocial-regular-webfont.svg': 'widget/font/zocial-regular-webfont.svg',
          'example/font/zocial-regular-webfont.ttf': 'widget/font/zocial-regular-webfont.ttf',
          'example/font/zocial-regular-webfont.woff': 'widget/font/zocial-regular-webfont.woff'
        }
      }
    },
    clean: {
      build: ["build/", "widget/css/main.css", "example/auth0-widget.js", "example/img/", "example/font/"],
    },
    watch: {
      another: {
        files: ['node_modules', 'index.js', 'widget/index.js', 'widget/html/*.html', 'widget/css/*.less'],
        tasks: ['build']
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",   ["clean", "less:dist", "browserify:dist", "uglify:min", "copy:example"]);
  grunt.registerTask("example", ["connect:example", "build", "watch"]);
};
