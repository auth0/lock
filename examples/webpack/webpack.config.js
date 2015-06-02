'use strict';

var config = {
  context: __dirname,
  entry: './src/app.js',
  output: {
    path: './public/build',
    filename: 'bundle.js',
    publicPath: '/build/'
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
