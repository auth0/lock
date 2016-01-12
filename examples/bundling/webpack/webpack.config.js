module.exports = {
  entry: "./index.js",
  output: {
    filename: 'build.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }]
  }
};
