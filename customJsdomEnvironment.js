const JSDOMEnvironment = require('jest-environment-jsdom').default;

module.exports = class CustomJsdomEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    // Expose jsdom instance globally so tests can call jsdom.reconfigure()
    this.global.jsdom = this.dom;
  }
};
