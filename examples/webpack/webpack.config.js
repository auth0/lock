'use strict';

var path = require('path');

var buildPath = path.resolve(__dirname, 'public', 'build');
var vendorPath = function(relativePath) {
  return path.join(path.join(__dirname, 'node_modules'), relativePath);
};

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
      include: vendorPath('auth0-lock'),
      loaders: [
        'transform-loader/cacheable?brfs',
        'transform-loader/cacheable?packageify'
      ]
    }, {
      test: /\.ejs$/,
      include: vendorPath('auth0-lock'),
      loader: 'transform-loader/cacheable?ejsify'
    }, {
      test: /\.json$/,
      include: [vendorPath('auth0-js'), vendorPath('auth0-lock')],
      loader: 'json-loader'
    }]
  }
};

module.exports = config;
