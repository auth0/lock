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
      loaders: ['transform?brfs', 'transform?packageify']
    }, {
      // ejs-compiled-loader will not work per bazilio91/ejs-compiled-loader#6.
      test: /\.ejs$/,
      loader: 'transform?ejsify'
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  }
};

module.exports = config;
