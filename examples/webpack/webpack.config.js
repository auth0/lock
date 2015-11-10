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
      test: /node_modules\/auth0-lock\/.*\.js$/,
      loaders: [
        'transform-loader/cacheable?brfs',
        'transform-loader/cacheable?packageify'
      ]
    }, {
      test: /node_modules\/auth0-lock\/.*\.ejs$/,
      loader: 'transform-loader/cacheable?ejsify'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};

module.exports = config;
