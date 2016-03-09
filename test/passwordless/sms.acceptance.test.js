import expect from 'expect.js';
import * as u from '../acceptance_test_utils';
import * as cc from '../../src/field/country_codes';

describe(".sms acceptance", function() {
  before(u.stubWebApis);
  after(u.restoreWebApis);

  describe("constructing a Lock", function() {
    before(function() {
      this.lock = u.constructLock();
    });

    it("doesn't render a thing", function() {
      expect(u.isRendered(this.lock)).to.not.be.ok();
    });
  });

  describe("opening a Lock", function() {
    before(function() {
      this.lock = u.constructLock();
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("doesn't open the Lock immediately", function() {
      u.openLock(this.lock, "sms");

      expect(u.isRendered(this.lock)).to.be.ok();
      expect(u.isOpened(this.lock)).to.not.be.ok();
    });

    it("opens it after a few ms", function(done) {
      setTimeout(() => {
        expect(u.isOpened(this.lock)).to.be.ok();
        done();
      }, 17);
    });

    it("displays an empty input for the phone number", function() {
      expect(u.qInputValue(this.lock, "phone-number")).to.be("");
    });

    it("displays an input with for the location with a default value", function() {
      expect(u.qInputValue(this.lock, "location")).to.be("+1 United States");
    });
  });

  describe("opening the location selector", function() {
    before(function() {
      this.lock = u.constructLock();
      u.openLock(this.lock, "sms");
    });

    after(function() {
      u.clickFirstLocation(this.lock); // necessary for the close button to show up
      u.closeLock(this.lock);
    });

    describe("when clicking the location input", function() {
      before(function() {
        u.clickInput(this.lock, "location");
      });

      it("shows the location selector", function() {
        expect(u.isShowingLocationSelector(this.lock)).to.be.ok();
      });
    });
  });

  describe("filtering locations", function() {
    before(function() {
      this.lock = u.constructLock();
      u.openLock(this.lock, "sms");
      u.clickInput(this.lock, "location");
    });

    after(function() {
      u.clickFirstLocation(this.lock); // necessary for the close button to show up
      u.closeLock(this.lock);
    });

    it("shows all locations available by default", function() {
      expect(u.qLocations(this.lock).length).to.be(cc.countryCodes.size);
    });

    describe("when entering an unexistent location name", function() {
      before(function() {
        u.filterLocations(this.lock, "nowhere");
      });

      it("doesn't show any locations", function() {
        expect(u.qLocations(this.lock).length).to.be(0);
      });
    });

    describe("when entering a few letters that match a few locations", function() {
      before(function() {
        u.filterLocations(this.lock, "united");
      });

      it("shows that locations", function() {
        expect(u.qLocations(this.lock).length).to.be.within(2, 10);
      });
    });

    describe("when entering an exact location name", function() {
      before(function() {
        u.filterLocations(this.lock, "spain");
      });

      it("shows only that location", function() {
        expect(u.qLocations(this.lock).length).to.be(1);
      });
    });
  });

  describe.skip("selecting a location", function() {
    before(function() {
      this.lock = u.constructLock();
      u.openLock(this.lock, "sms");
      u.clickInput(this.lock, "location");
      u.filterLocations(this.lock, "spain");
      u.clickFirstLocation(this.lock);
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("closes the location selector", function(done) {
      // NOTE: to tell whether or not the location selector has been closed, we
      // need to wait for the enter transition to finish.
      setTimeout(() => {
        expect(u.isShowingLocationSelector(this.lock)).to.not.be.ok();
        done();
      }, u.AUXILIARY_PANE_DELAY);
    });

    it("updates the location input", function() {
      expect(u.qInputValue(this.lock, "location")).to.be("Spain +34");
    });

    describe("when submiting", function() {
      before(function() {
        u.fillInput(this.lock, "phone-number", "0303456");
        u.submit(this.lock);
      });

      it("starts the passwordless flow with the given location", function() {
        const params = {phoneNumber: "+340303456"};
        expect(u.hasStartedPasswordless(params)).to.be.ok();
      });
    });
  });

  describe("entering an invalid phone number", function() {
    before(function() {
      this.lock = u.constructLock();
      u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "invalid number");
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("doesn't mark the input as invalid", function() {
      expect(u.isInputInvalid(this.lock, "phone-number")).to.not.be.ok();
    });

    describe("when attempting a submit", function() {
      before(function() {
        u.submit(this.lock);
      });

      it("marks the input as invalid", function() {
        expect(u.isInputInvalid(this.lock, "phone-number")).to.be.ok();
      });

      it("doesn't perform any request", function() {
        expect(u.hasStartedPasswordless(false)).to.be.ok();
        expect(u.isInputInvalid(this.lock, "phone-number")).to.be.ok();
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      describe("when fixing the phone number", function() {
        before(function() {
          u.fillInput(this.lock, "phone-number", "0303456");
        });

        it("clears the input error", function() {
          expect(u.isInputInvalid(this.lock, "phone-number")).to.not.be.ok();
        });

        describe("and entering an invalid phone number again", function() {
          before(function() {
            u.fillInput(this.lock, "phone-number", "invalid number");
          });

          it("doesn't mark the input as invalid", function() {
            expect(u.isInputInvalid(this.lock, "phone-number")).to.not.be.ok();
          });
        });
      });
    });
  });

  describe("successfully submitting a phone number", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "0303456");
      u.submit(this.lock);
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("starts the passwordless flow", function() {
      const params = {phoneNumber: "+10303456"};
      expect(u.hasStartedPasswordless(params)).to.be.ok();
    });

    describe("when response arrives", function() {
      before(function() {
        u.simulateStartPasswordlessResponse();
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it("waits until the vcode credential pane appears", function(done) {
        this.timeout(u.CRED_PANE_DELAY + 3000);
        setTimeout(done, u.CRED_PANE_DELAY);
      });

      it("doesn't show an input for the phone number", function() {
        expect(u.qInput(this.lock, "phone-number")).to.not.be.ok();
      });

      it("shows an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.be.ok();
      });

      it("doesn't invoke the provided callback", function() {
        expect(this.cb.called).to.not.be.ok();
      });
    });
  });

  describe("unsuccessful attempt to submit a phone number", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "0303456");
      u.submit(this.lock);
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("starts the passwordless flow", function() {
      const params = {phoneNumber: "+10303456"};
      expect(u.hasStartedPasswordless(params)).to.be.ok();
    });

    describe("when response arrives", function() {
      before(function(done) {
        u.simulateStartPasswordlessResponse({error: "unknown"});
        setTimeout(done, 300);
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it("still shows an input for the phone number", function() {
        expect(u.qInput(this.lock, "phone-number")).to.be.ok();
      });

      it("doesn't show an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.not.be.ok();
      });

      it("doesn't invoke the provided callback", function() {
        expect(this.cb.called).to.not.be.ok();
      });

      it("shows a generic error", function() {
        const errorMessage = "We're sorry, something went wrong when sending the SMS";
        expect(u.isSomethingWrong(this.lock, errorMessage)).to.be.ok();
      });
    });
  });

  describe("submitting an empty vcode", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "123456");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
      u.submit(this.lock);
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("waits until the vcode credential pane appears", function(done) {
      this.timeout(u.CRED_PANE_DELAY + 3000);
      setTimeout(done, u.CRED_PANE_DELAY);
    });

    it("marks the input as invalid", function() {
      expect(u.isInputInvalid(this.lock, "vcode")).to.be.ok();
    });

    it("doesn't perform any request", function() {
      expect(u.hasStartedPasswordless(false)).to.be.ok();
      expect(u.isLoading(this.lock)).to.not.be.ok();
    });

    describe("when filling the vcode", function() {
      before(function() {
        u.fillInput(this.lock, "vcode", "1");
      });

      it("clears the input error", function() {
        expect(u.isInputInvalid(this.lock, "vcode")).to.not.be.ok();
      });

      describe("and clearing the vcode", function() {
        before(function() {
          u.fillInput(this.lock, "vcode", "");
        });

        it("doesn't mark the input as invalid", function() {
          expect(u.isInputInvalid(this.lock, "vcode")).to.not.be.ok();
        });
      });
    });
  });

  describe("successfully submitting the vcode", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "0303456");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("waits until the vcode credential pane appears", function(done) {
      this.timeout(u.CRED_PANE_DELAY + 3000);
      setTimeout(done, u.CRED_PANE_DELAY);
    });

    it("submits the vcode", function() {
      u.fillInput(this.lock, "vcode", "1234");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("attempts to sign in with the entered cred", function() {
      expect(u.hasSignedInWith({phoneNumber: "+10303456", passcode: "1234"})).to.be.ok();
    })

    describe("when response arrives", function() {
      before(function() {
        u.simulateSingInResponse();
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it.skip("doesn't show an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.not.be.ok();
      });

      it("invokes the provided callback", function() {
        expect(this.cb.calledOnce).to.be.ok();
        // TODO: "fake arg" is a detail implementation of the utils module, so
        // it should be handled over there.
        expect(this.cb.calledWithExactly(null, "fake arg")).to.be.ok();
      });
    });
  });

  describe("unsuccessful attempt to submit the vcode", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "sms");
      u.fillInput(this.lock, "phone-number", "0303456");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
    });

    after(function() {
      u.closeLock(this.lock);
    });

    it("waits until the vcode credential pane appears", function(done) {
      this.timeout(u.CRED_PANE_DELAY + 3000);
      setTimeout(done, u.CRED_PANE_DELAY);
    });

    it("submits the vcode", function() {
      u.fillInput(this.lock, "vcode", "1234");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("attempts to sign in with the entered cred", function() {
      expect(u.hasSignedInWith({phoneNumber: "+10303456", passcode: "1234"})).to.be.ok();
    })

    describe("when response arrives", function() {
      before(function(done) {
        this.error = {error: "invalid_user_password"};
        u.simulateSingInResponse(this.error);
        setTimeout(done, 300);
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it("still shows an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.be.ok();
      });

      it("doesn't close the Lock", function() {
        expect(u.isOpened(this.lock)).to.be.ok();
      });

      it("invokes the provided callback", function() {
        expect(this.cb.calledOnce).to.be.ok();
        expect(this.cb.calledWithExactly(this.error)).to.be.ok();
      });

      it("shows the received error description", function() {
        expect(u.isSomethingWrong(this.lock, "Wrong phone number or verification code")).to.be.ok();
      });
    });
  });
});
