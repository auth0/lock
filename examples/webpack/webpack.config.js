'use strict';
var buildPath = require('path').resolve(__dirname, 'public', 'build');

var config = {
  context: __dirname,
  entry: './src/app.js',
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['transform?brfs', 'transform?packageify']
    }, {
      test: /\.ejs$/,
      loader: 'transform?ejsify'
    }, {
      test: /.json$/,
      loader: 'json'
    }]
  }
};

module.exports = config;
