import expect from 'expect.js';
import * as h from './helper/ui';

describe("enterprise quick auth", function() {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe("when there's only an ad connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["ad.com"],
        rememberLastLogin: false,
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("doesn't show a quick auth screen", function() {
      expect(h.hasNoQuickAuthButton(this.lock)).to.be.ok();
      expect(h.hasUsernameInput(this.lock)).to.be.ok(); // checks for corporate login
    });
  });

  describe("when there's only an adfs connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["adfs.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the windows icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "windows", "adfs.com")).to.be.ok();
    });
  });

  describe("when there's only an auth0-adldap connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["auth0-adldap.com"],
        rememberLastLogin: false,
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("doesn't show a quick auth screen", function() {
      expect(h.hasNoQuickAuthButton(this.lock)).to.be.ok();
      expect(h.hasUsernameInput(this.lock)).to.be.ok();  // checks for corporate login
    });
  });

  describe("when there's only a custom connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["custom.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "custom.com")).to.be.ok();
    });
  });

  describe("when there's only a google-apps connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["google-apps.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the google icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "google-apps", "google-apps.com")).to.be.ok();
    });
  });

  describe("when there's only an ip connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["ip.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "ip.com")).to.be.ok();
    });
  });

  describe("when there's only a mscrm connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["mscrm.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "mscrm.com")).to.be.ok();
    });
  });

  describe("when there's only an office365 connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["office365.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the windows icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "windows", "office365.com")).to.be.ok();
    });
  });

  describe("when there's only a pingfederate connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["pingfederate.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "pingfederate.com")).to.be.ok();
    });
  });

  describe("when there's only a samlp connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["samlp.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "samlp.com")).to.be.ok();
    });
  });

  describe("when there's only a sharepoint connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["sharepoint.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the default icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "auth0", "sharepoint.com")).to.be.ok();
    });
  });

  describe("when there's only an waad connection", function() {
    beforeEach(function(done) {
      const opts = {
        allowedConnections: ["waad.com"],
        rememberLastLogin: false
      };

      this.lock = h.displayLock("", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("shows a login button with the windows icon", function() {
      expect(h.hasQuickAuthButton(this.lock, "windows", "waad.com")).to.be.ok();
    });
  });

});
