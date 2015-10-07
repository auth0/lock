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
      loaders: ['transform/cacheable?brfs', 'transform/cacheable?packageify']
    }, {
      test: /\.ejs$/,
      loader: 'ejs-compiled',
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  }
};

module.exports = config;
