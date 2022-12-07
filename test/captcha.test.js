'use strict';

import expect from 'expect.js';
import * as h from './helper/ui';
import en from '../src/i18n/en';

const lockOpts = {
  allowedConnections: ['db'],
  rememberLastLogin: false
};

const svgCaptchaRequiredResponse1 = {
  required: true,
  image: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  type: 'code'
};

const svgCaptchaRequiredResponse2 = {
  required: true,
  image: 'data:image/gif;base64,blibli',
  type: 'code'
};

const recaptchav2Response = {
  required: true,
  provider: 'recaptcha_v2',
  siteKey: 'my_site_key'
};

describe('captcha', function () {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe('svg-captcha', () => {
    describe('when the api returns a new challenge', function () {
      beforeEach(function (done) {
        this.stub = h.stubGetChallenge([svgCaptchaRequiredResponse1, svgCaptchaRequiredResponse2]);
        this.lock = h.displayLock('', lockOpts, done);
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should show the captcha input', function (done) {
        setTimeout(() => {
          expect(h.qInput(this.lock, 'captcha', false)).to.be.ok();
          done();
        }, 500);
      });

      it('should require another challenge when clicking the refresh button', function (done) {
        h.clickRefreshCaptchaButton(this.lock);
        setTimeout(() => {
          expect(h.q(this.lock, '.auth0-lock-captcha-image').style.backgroundImage).to.equal(
            `url("${svgCaptchaRequiredResponse2.image}")`
          );
          done();
        }, 200);
      });

      it('should submit the captcha provided by the user', function () {
        h.logInWithEmailPasswordAndCaptcha(this.lock, () => {
          expect(h.wasLoginAttemptedWith({ captcha: 'captchaValue' })).to.be.ok();
        });
      });

      it('should not submit the form if the captcha is not provided', function (done) {
        h.logInWithEmailAndPassword(this.lock, () => {
          h.waitUntilErrorExists(this.lock, () => {
            expect(h.wasLoginAttemptedWith({})).to.not.be.ok();
            expect(h.hasErrorMessage(this.lock, en.error.login.invalid_captcha)).to.be.ok();
            done();
          });
        });
      });
    });

    describe('when the challenge api returns required: false', function () {
      beforeEach(function (done) {
        h.stubGetChallenge({
          required: false
        });
        this.lock = h.displayLock('', lockOpts, done);
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should not show the captcha input', function () {
        expect(h.qInput(this.lock, 'captcha', false)).to.not.be.ok();
      });

      describe('when the form submission fails and the transaction starts requiring a challenge', function () {
        beforeEach(function (done) {
          h.assertAuthorizeRedirection((lockID, options, authParams, cb) => {
            cb(new Error('bad request'));
            setTimeout(done, 300);
          });

          h.stubGetChallenge(svgCaptchaRequiredResponse1);
          h.fillEmailInput(this.lock, 'someone@example.com');
          h.fillPasswordInput(this.lock, 'mypass');
          h.submitForm(this.lock);
        });

        it('should call the challenge api again and show the input', function () {
          expect(h.qInput(this.lock, 'captcha', false)).to.be.ok();
        });
      });
    });
  });

  describe('recaptchav2', () => {
    describe('when the api returns a new challenge', function () {
      beforeEach(function (done) {
        this.stub = h.stubGetChallenge([recaptchav2Response]);
        this.lock = h.displayLock('', lockOpts, done);
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should load the captcha script', function () {
        expect(h.q(this.lock, '.auth0-lock-recaptchav2')).to.be.ok();
      });

      it('should show the captcha input', function () {
        expect(h.q(this.lock, '.auth0-lock-recaptchav2')).to.be.ok();
      });

      it('should not submit the form if the captcha is not provided', function (done) {
        h.logInWithEmailAndPassword(this.lock, () => {
          h.waitUntilErrorExists(this.lock, () => {
            expect(h.wasLoginAttemptedWith({})).to.not.be.ok();
            expect(h.hasErrorMessage(this.lock, en.error.login.invalid_recaptcha)).to.be.ok();
            done();
          });
        });
      });
    });

    describe('when the challenge api returns required: false', function () {
      let notRequiredStub;
      beforeEach(function (done) {
        notRequiredStub = h.stubGetChallenge({
          required: false
        });
        this.lock = h.displayLock('', lockOpts, done);
      });

      afterEach(function () {
        this.lock.hide();
      });

      it('should not show the captcha input', function () {
        expect(h.q(this.lock, '.auth0-lock-recaptchav2')).to.not.be.ok();
      });

      describe('when the form submission fails and the transaction starts requiring a challenge', function () {
        let challengeStub;
        beforeEach(function (done) {
          h.assertAuthorizeRedirection((lockID, options, authParams, cb) => {
            cb(new Error('bad request'));
            // We wait 250ms to display errors
            setTimeout(done, 260);
          });

          challengeStub = h.stubGetChallenge(recaptchav2Response);
          h.fillEmailInput(this.lock, 'someone@example.com');
          h.fillPasswordInput(this.lock, 'mypass');
          h.submitForm(this.lock);
        });

        it('should call the challenge api again and show the input', function () {
          h.waitUntilExists(this.lock, '.auth0-lock-recaptchav2', () => {
            expect(notRequiredStub.calledOnce).to.be.true;
            expect(challengeStub.calledOnce).to.be.true;
            expect(h.q(this.lock, '.auth0-lock-recaptchav2')).to.be.ok();
          });
        });
      });
    });
  });
});
