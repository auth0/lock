module.exports = function(config) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['mocha', 'browserify'],

    //plugins
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
      {
        pattern: 'src/!(__tests__)/**/*.jsx?',
        type: 'js'
      }
    ],

    preprocessors: {
      'src/!(__tests__)/**/*.jsx?': ['browserify'],
      'test/**/*.js': ['browserify']
    },

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

    singleRun: true,

    browserNoActivityTimeout: 60000,

    browserDisconnectTimeout: 20000,

    browserDisconnectTolerance: 3,

    // level of logging
    logLevel: config.LOG_INFO,

    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      name: 'Lock.js Browser Tests',
      project: 'Lock.js SDK'
    },

    mochaReporter: {
      output: 'minimal'
    },

    // define browsers
    customLaunchers: {
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
        displayName: 'Chrome on Windows 10'
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
        displayName: 'Latest Safari on Big Sur'
      },
      bs_ie11_windows: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '10',
        displayName: 'IE11 on Windows 10'
      },
      chrome_headless: {
        base: 'Chrome',
        flags: ['--headless']
      }
    },

    browsers: [
      'bs_chrome_windows',
      'bs_firefox_windows',
      'bs_safari',
      'bs_ie11_windows',
      'bs_edge_windows'
    ]
  });
};
