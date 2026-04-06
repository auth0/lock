const pkg = require('./package.json');
const coreJsVersion = pkg.devDependencies['core-js'].replace(/^\^/, '');

module.exports = {
  plugins: [
    'version-inline',
    'transform-css-import-to-string',
    'babel-plugin-stylus-compiler',
    '@babel/plugin-proposal-function-bind'
  ],
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'entry', corejs: coreJsVersion }],
    '@babel/preset-react'
  ]
};
