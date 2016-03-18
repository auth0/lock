'use strict';
var path = require('path');
var buildPath = path.resolve(__dirname, 'public', 'build');
var entryPath = path.resolve(__dirname, 'src', 'app');

var config = {
  context: __dirname,
  entry: entryPath,
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
      loaders: [
        'transform-loader/cacheable?brfs',
        'transform-loader/cacheable?packageify'
      ]
    }, {
      test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
      loader: 'transform-loader/cacheable?ejsify'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};

module.exports = config;
