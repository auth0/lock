'use strict';
var buildPath = require('path').resolve(__dirname, 'public', 'build');

var config = {
  context: __dirname,
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/app.js'
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: './public/'
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
