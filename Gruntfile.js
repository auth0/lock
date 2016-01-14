"use strict";

var fs = require("fs");
var pkg = require("./package");

var minor_version = pkg.version.replace(/\.(\d)*$/, "");
var major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, "");
var path = require("path");

function rename_release (v) {
  return function (d, f) {
    var dest = path.join(d, f.replace(/(\.min)?\.js$/, "-"+ v + "$1.js"));
    return dest;
  };
}

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        region:          process.env.S3_REGION,
        uploadConcurrency: 5,
        params: {
          CacheControl: "public, max-age=300"
        },
        // debug: true <<< use this option to test changes
      },
      clean: {
        files: [
          {action: "delete", dest: "js/lock-passwordless-" + pkg.version + ".js"},
          {action: "delete", dest: "js/lock-passwordless-" + pkg.version + ".min.js"},
          {action: "delete", dest: "js/lock-passwordless-" + major_version + ".js"},
          {action: "delete", dest: "js/lock-passwordless-" + major_version + ".min.js"},
          {action: "delete", dest: "js/lock-passwordless-" + minor_version + ".js"},
          {action: "delete", dest: "js/lock-passwordless-" + minor_version + ".min.js"}
        ]
      },
      publish: {
        files: [
          {
            expand: true,
            cwd:    "release/",
            src:    ["**"],
            dest:   "js/"
          }
        ]
      }
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
        dest: "build/lock-passwordless.js"
      },
      build: {
        src: "src/browser.js",
        dest: "build/lock-passwordless.js"
      },
      design: {
        options: {
          watch: true,
        },
        src: "support/design/index.js",
        dest: "build/lock-passwordless.design.js"
      }
    },
    clean: {
      build: ["build/", "release/"],
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
    copy: {
      release: {
        files: [
          {expand: true, flatten: true, src: "build/*", dest: "release/", rename: rename_release(pkg.version)},
          {expand: true, flatten: true, src: "build/*", dest: "release/", rename: rename_release(minor_version)},
          {expand: true, flatten: true, src: "build/*", dest: "release/", rename: rename_release(major_version)}
        ]
      },
      pages: {
        files: [
          {expand: true, flatten: true, src: "build/*", dest: "support/playground/build/"},
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
    http: {
      purge_js:           {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + pkg.version + ".js",       method: "DELETE"}},
      purge_js_min:       {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + pkg.version + ".min.js",   method: "DELETE"}},
      purge_major_js:     {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + major_version + ".js",     method: "DELETE"}},
      purge_major_js_min: {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + major_version + ".min.js", method: "DELETE"}},
      purge_minor_js:     {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + minor_version + ".js",     method: "DELETE"}},
      purge_minor_js_min: {options: {url: process.env.CDN_ROOT + "/js/lock-passwordless-" + minor_version + ".min.js", method: "DELETE"} }
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
        src: "build/lock-passwordless.js",
        dest: "build/lock-passwordless.min.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-aws-s3");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-http");


  grunt.registerTask("build", ["clean:build", "env:build", "stylus:build", "browserify:build", "uglify:build"]);
  grunt.registerTask("dist", ["clean:dist", "stylus:build", "babel:dist"]);
  grunt.registerTask("prepare_dev", ["clean:dev", "connect:dev", "stylus:build"]);
  grunt.registerTask("dev", ["prepare_dev", "browserify:dev", "watch"]);
  grunt.registerTask("design", ["prepare_dev", "browserify:design", "watch"]);
  grunt.registerTask("purge_cdn", ["http:purge_js", "http:purge_js_min", "http:purge_major_js", "http:purge_major_js_min", "http:purge_minor_js", "http:purge_minor_js_min"]);
  grunt.registerTask("cdn", ["build", "copy:release", "aws_s3:clean", "aws_s3:publish", "purge_cdn"]);
  grunt.registerTask("ghpages", ["build", "copy:pages"]); // add publish task
};
