import expect from 'expect.js';
import * as h from './helper/ui';

describe("sign up terms agreement", function() {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe("without a mustAcceptTerms opt", function() {
    beforeEach(function(done) {
      const opts = {
        initialScreen: "signUp",
        rememberLastLogin: false
      };

      this.lock = h.displayLock("single database", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });

    it("should not ask the user to accept terms", function() {
      expect(h.hasSubmitButton(this.lock)).to.be.ok();
      expect(h.isSubmitButtonDisabled(this.lock)).to.not.be.ok();
      expect(h.hasTermsCheckbox(this.lock)).to.not.be.ok();
    });
  });

  describe("with a mustAcceptTerms opt", function() {
    beforeEach(function(done) {
      const opts = {
        initialScreen: "signUp",
        mustAcceptTerms: true,
        rememberLastLogin: false
      };

      this.lock = h.displayLock("single database", opts, done);
    });

    afterEach(function() {
      this.lock.hide();
    });


    it("asks the user to accept terms before sumbitting", function() {
      expect(h.isSubmitButtonDisabled(this.lock)).to.be.ok();
      expect(h.hasTermsCheckbox(this.lock)).to.be.ok();
    });

    describe("when the terms are accepted", function() {
      beforeEach(function() {
        h.clickTermsCheckbox(this.lock);
      });

      it("lets the user sign up", function() {
        expect(h.hasTermsCheckbox(this.lock)).to.be.ok();
        expect(h.hasSubmitButton(this.lock)).to.be.ok();
        expect(h.isSubmitButtonDisabled(this.lock)).to.not.be.ok();
      });

      describe("and then rejected", function() {
        beforeEach(function() {
          h.clickTermsCheckbox(this.lock);
        });

        it("lets the user sign up", function() {
          expect(h.hasTermsCheckbox(this.lock)).to.be.ok();
          expect(h.isSubmitButtonDisabled(this.lock)).to.be.ok();
        });
      });
    });
  });

});
