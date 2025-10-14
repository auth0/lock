module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: false
        },
        useBuiltIns: 'entry',
        corejs: '3.26.1'
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-function-bind',
    "babel-plugin-stylus-compiler",
    "version-inline",
    "transform-css-import-to-string",
    '@babel/plugin-proposal-object-rest-spread'
  ]
};
