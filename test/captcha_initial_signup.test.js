import expect from 'expect.js';
import * as h from './helper/ui';

const lockOpts = {
  allowedConnections: ['db'],
  rememberLastLogin: false,
  initialScreen: 'signUp'  // This is the key difference
};

const svgCaptchaRequiredResponse = {
  required: true,
  image: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  type: 'code'
};

const recaptchav2Response = {
  required: true,
  provider: 'recaptcha_v2',
  siteKey: 'my_site_key'
};

describe('captcha with initialScreen: signUp', function () {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe('svg-captcha', () => {
    describe('when initialScreen is set to signUp and signup challenge is required', function () {
      beforeEach(function (done) {
        // Stub both login challenge (not required) and signup challenge (required)
        h.stubGetChallenge({ required: false });
        h.stubGetSignupChallenge(svgCaptchaRequiredResponse);
        
        // Display lock with initialScreen: 'signUp'
        this.lock = h.displayLock('', lockOpts, () => {
          // Wait for the signup screen to be ready
          h.waitUntilExists(this.lock, '.auth0-lock-with-terms', done);
        });
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should immediately show the signup screen', function () {
        expect(h.isSignUpTabCurrent(this.lock)).to.be.ok();
      });

      it('should show the captcha input immediately without clicking signup tab', function (done) {
        // This is the main test - captcha should be visible immediately
        // without needing to click the signup tab
        setTimeout(() => {
          expect(h.qInput(this.lock, 'captcha', false)).to.be.ok();
          done();
        }, 500);
      });

      it('should submit the captcha provided by the user', function (done) {
        h.signUpWithEmailPasswordAndCaptcha(this.lock, () => {
          expect(h.wasSignUpAttemptedWith({ captcha: 'captchaValue' })).to.be.ok();
          done();
        });
      });
    });
  });

  describe('recaptcha_v2', () => {
    describe('when initialScreen is set to signUp and signup challenge is required', function () {
      beforeEach(function (done) {
        // Stub both login challenge (not required) and signup challenge (required)
        h.stubGetChallenge({ required: false });
        h.stubGetSignupChallenge(recaptchav2Response);
        
        this.lock = h.displayLock('', lockOpts, () => {
          h.waitUntilExists(this.lock, '.auth0-lock-with-terms', done);
        });
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should load the captcha script and show recaptcha immediately', function (done) {
        h.waitUntilExists(this.lock, '.auth0-lock-recaptchav2', () => {
          expect(h.q(this.lock, '.auth0-lock-recaptchav2')).to.be.ok();
          done();
        });
      });
    });
  });

  describe('when signup challenge is not required', () => {
    beforeEach(function (done) {
      // Both login and signup challenges not required
      h.stubGetChallenge({ required: false });
      h.stubGetSignupChallenge({ required: false });
      
      this.lock = h.displayLock('', lockOpts, () => {
        h.waitUntilExists(this.lock, '.auth0-lock-with-terms', done);
      });
    });

    afterEach(function () {
      this.lock.hide();
    });

    it('should not show the captcha input when not required', function () {
      expect(h.qInput(this.lock, 'captcha', false)).to.not.be.ok();
    });
  });
});
