"use strict";

var path = require('path');
var fs = require("fs");
var pkg = require("./package");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      build: ["build/"],
      dev: ["build/"],
      dist: ["lib/"]
    },
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
      },
      dev: {
        files: ["src/**/*"],
        tasks: ["webpack"],
        options: {
          spawn: false,
        }
      }
    },
    webpack: {
      options: webpackConfig,
      build: {
        watch: false,
        keepalive: false,
        inline: false,
        hot: false,
        devtool: 'source-map',
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
            // output: './build/lock.min.js'
          })
        ]
      }
    },
    "webpack-dev-server": {
      options: {
        webpack: webpackConfig,
        publicPath: "/build/"
      },
      dev: {
        keepAlive: true,
        webpack: {
          devtool: "eval",
          debug: true
        }
      },
      design: {
        keepAlive: true,
        webpack: {
          output: { 
            path: path.join(__dirname, "build"), 
            filename: 'lock.design.js' 
          },
          devtool: "eval",
          debug: true
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("build", ["clean:build", "env:build", "stylus:build", "webpack:build"]);
  grunt.registerTask("dist", ["clean:dist", "stylus:build", "babel:dist"]);
  grunt.registerTask("prepare_dev", ["clean:dev", "stylus:build"]);
  grunt.registerTask("dev", ["prepare_dev", "webpack-dev-server:dev", "watch"]);
  grunt.registerTask("design", ["prepare_dev", "webpack-dev-server:design", "watch"]);
};
