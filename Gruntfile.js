"use strict";

var fs = require("fs");
var pkg = require("./package");

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      dist: {
        files: [
          {
            expand: true,
            cwd:    "src",
            src:    ["**/*.js", "**/*.jsx"],
            dest:   "lib",
            ext: '.js'
          }
        ]
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          extensions: ".jsx",
          transform: ["babelify"]
        }
      },
      dev: {
        options: {
          browserifyOptions: {
            debug: true,
            extensions: ".jsx",
            transform: ["babelify"]
          },
          watch: true
        },
        src: "src/browser.js",
        dest: "build/lock.js"
      },
      build: {
        src: "src/browser.js",
        dest: "build/lock.js"
      },
      design: {
        options: {
          browserifyOptions: {
            debug: true,
            extensions: ".jsx",
            transform: ["babelify"],
            // plugin: ['livereactload']
          },
          watch: true
        },
        src: "support/design/index.js",
        dest: "build/lock.design.js"
      }
    },
    clean: {
      build: ["build/"],
      dev: ["build/"],
      dist: ["lib/"]
    },
    connect: {
      dev: {
        options: {
          hostname: "*",
          base: [".", "build", "support", "support/playground"],
          port: process.env.PORT || 3000
        }
      },
    },
    env: {
      build: {
        NODE_ENV: "production"
      }
    },
    exec: {
      touch_index: "touch src/index.js"
    },
    stylus: {
      build: {
        options: {
          compress: false // temp
        },
        src: "css/index.styl",
        dest: "css/index.css"
      }
    },
    watch: {
      stylus: {
        files: ["css/index.styl"],
        tasks: ["stylus:build", "exec:touch_index"]
      }
    },
    uglify: {
      build: {
        src: "build/lock.js",
        dest: "build/lock.min.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-exec");


  grunt.registerTask("build", ["clean:build", "env:build", "stylus:build", "browserify:build", "uglify:build"]);
  grunt.registerTask("dist", ["clean:dist", "stylus:build", "babel:dist"]);
  grunt.registerTask("prepare_dev", ["clean:dev", "connect:dev", "stylus:build"]);
  grunt.registerTask("dev", ["prepare_dev", "browserify:dev", "watch"]);
  grunt.registerTask("design", ["prepare_dev", "browserify:design", "watch"]);
};
