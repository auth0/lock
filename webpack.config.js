var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/browser.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'lock.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.styl']
  },
  progress: true,
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    poll: true
  },
  inline: true,
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.styl$/,
        use: [
          'css-loader',
          'stylus-loader',
          {
            loader: 'stylus-loader',
            options: {
              paths: [
                'node_modules/bootstrap-stylus/stylus'
              ],
              preferPathResolver: 'webpack'
            }
          }
        ]
      }
    ]
  }
};
