var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'build.js'
  },
  devServer: {
    contentBase: './',
    https: true,
    port: 3000
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
