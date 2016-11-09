var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/browser.js',
  output: {
    path: path.join(__dirname, "../build"),
    filename: 'lock.js'
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".styl"]
  },
  progress: true,
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    poll: true
  },
  keepalive: true,
  inline: true,
  hot: true,
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
  stylus: {
    preferPathResolver: 'webpack',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: __dirname + './node_modules',
        query: {
          plugins: ["version-inline", "transform-css-import-to-string"],
          presets: ["es2015-loose", "stage-0", "react"]
        }
      },
      {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      }
    ]
  },
};