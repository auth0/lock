// karma.conf.js
module.exports = function (config) {
  // Point Chrome to the Puppeteer‐bundled binary
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['mocha', 'browserify'],

    // plugins
    plugins: [
      'karma-mocha',
      'karma-babel-preprocessor',
      'karma-browserstack-launcher',
      'karma-chrome-launcher',
      'karma-browserify',
      'karma-mocha-reporter'
    ],

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.test.js',
      'test/setup.js',
      // include all JS/JSX under src, but we'll exclude __tests__ folders below
      { pattern: 'src/**/*.js?(x)', watched: false }
    ],

    // files to exclude
    exclude: [
      'src/**/__tests__/**'
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'src/**/*.js?(x)': ['browserify'],
      'test/**/*.js': ['browserify']
    },

    // browserify configuration
    browserify: {
      debug: true,
      transform: ['babelify'],
      extensions: ['.js', '.jsx']
    },

    // test results reporter to use
    reporters: ['mocha', 'BrowserStack'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Continuous Integration mode
    singleRun: true,

    // timeouts
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout:    30000,
    browserDisconnectTolerance:  10,

    // level of logging
    logLevel: config.LOG_INFO,

    // BrowserStack credentials & config
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      name: 'Lock.js Browser Tests',
      project: 'Lock.js SDK'
    },

    mochaReporter: {
      output: 'minimal'
    },

    // define custom launchers
    customLaunchers: {
      // BrowserStack launchers
      bs_chrome_windows: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '10',
        displayName: 'Chrome on Windows 10'
      },
      bs_edge_windows: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '10',
        displayName: 'Edge on Windows 10'
      },
      bs_firefox_windows: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '10',
        displayName: 'Firefox on Windows 10'
      },
      bs_safari: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Big Sur',
        displayName: 'Safari on Big Sur'
      },
      bs_ie11_windows: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10',
        displayName: 'IE11 on Windows 10'
      },

      // Headless Chrome for CI/local without sandbox
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },

    // pick which browsers to run on; override via --browsers CLI if needed
    // for CI (npm run test:e2e) we'll default to headless
    browsers: ['ChromeHeadlessNoSandbox']
  });
};
