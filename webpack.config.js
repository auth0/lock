const { spawnSync } = require('child_process');
const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

/**
 * This is a helper function to generate valid certs using mkcert.
 * If mkcert is not installed it will return false.
 */
function getDevCerts() {
  let result = false;
  const tmpDir = tmp.dirSync({ unsafeCleanup: true, prefix: 'lock-dev-' });

  try {
    spawnSync('mkcert', ['localhost'], { cwd: tmpDir.name });
    result = {
      key: fs.readFileSync(path.join(tmpDir.name, 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(tmpDir.name, 'localhost.pem'))
    };
  } catch (err) {}

  tmpDir.removeCallback();
  return result;
}

module.exports = {
  entry: './src/browser.js',
  mode: 'development',
  target: 'browserslist',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'lock.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.styl']
  },
  devtool: 'source-map',
  progress: true,
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    poll: true
  },
  devServer: {
    hot: true,
    port: 3000,
    https: getDevCerts() || true,
    static: {
      directory: path.join(__dirname, 'support'),
      publicPath: '/support'
    }
  },
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
              paths: ['node_modules/bootstrap-stylus/stylus'],
              preferPathResolver: 'webpack'
            }
          }
        ]
      }
    ]
  }
};
