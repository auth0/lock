var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var compiler = webpack(require('./webpack.config.js'));
compiler.plugin('compile', function () {
  console.log('Bundling...');
});
compiler.plugin('done', function () {
  console.log('Bundle done!');
});

var bundler = new WebpackDevServer(compiler, {
  publicPath: './public/',
  contentBase: './public/',
  inline: true,
  hot: true,
  quiet: false,
  noInfo: true,
  stats: {
    colors: true
  }
});

bundler.listen(3000, 'localhost', function () {
  console.log('Lock webpack example is up at http://localhost:3000');
});
