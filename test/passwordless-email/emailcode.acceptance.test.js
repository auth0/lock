import expect from 'expect.js';
import * as u from '../acceptance_test_utils';

describe.skip(".emailcode acceptance", function() {
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
      u.openLock(this.lock, "emailcode");
    });

    it("renders the widget and opens it after a few ms", function(done) {
      expect(u.isRendered(this.lock)).to.be.ok();
      expect(u.isOpened(this.lock)).to.not.be.ok();
      setTimeout(() => {
        expect(u.isOpened(this.lock)).to.be.ok();
        done();
      }, 17);
    });

    it("displays an empty input for the email", function() {
      expect(u.qInputValue(this.lock, "email")).to.be("");
    });
  });

  describe("entering an invalid email", function() {
    before(function() {
      this.lock = u.constructLock();
      u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "invalid email");
    });


    it("doesn't mark the input as invalid", function() {
      expect(u.isInputInvalid(this.lock, "email")).to.not.be.ok();
    });

    describe("when attempting a submit", function() {
      before(function() {
        u.submit(this.lock);
      });

      it("marks the input as invalid", function() {
        expect(u.isInputInvalid(this.lock, "email")).to.be.ok();
      });

      it("doesn't perform any request", function() {
        expect(u.startPasswordlessCallCount()).to.be(0);
        expect(u.isInputInvalid(this.lock, "email")).to.be.ok();
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      describe("when fixing the email", function() {
        before(function() {
          u.fillInput(this.lock, "email", "someone@auth0.com");
        });

        it("clears the input error", function() {
          expect(u.isInputInvalid(this.lock, "email")).to.not.be.ok();
        });

        describe("and entering an invalid email again", function() {
          before(function() {
            u.fillInput(this.lock, "email", "invalid email");
          });

          it("doesn't mark the input as invalid", function() {
            expect(u.isInputInvalid(this.lock, "email")).to.not.be.ok();
          });
        });
      });
    });
  });

  describe("successfully submitting an email", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "someone@auth0.com");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("starts the passwordless flow", function() {
      const params = {email: "someone@auth0.com", send: "code"};
      expect(u.hasStartedPasswordless(params)).to.be.ok();
    });

    describe("when response arrives", function() {
      before(function(done) {
        setTimeout(() => {
          u.simulateStartPasswordlessResponse();
          done();
        }, 500);
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it("doesn't show an input for the email", function() {
        expect(u.qInput(this.lock, "email")).to.not.be.ok();
      });

      it("shows an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.be.ok();
      });

      it("doesn't invoke the provided callback with the entered email", function() {
        expect(this.cb.called).to.not.be.ok();
      });
    });
  });

  describe("unsuccessful attempt to submit an email", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "someone@auth0.com");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("starts the passwordless flow", function() {
      const params = {email: "someone@auth0.com", send: "code"};
      expect(u.hasStartedPasswordless(params)).to.be.ok();
    });

    describe("when response arrives", function() {
      before(function() {
        u.simulateStartPasswordlessResponse({});
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      it("still shows an input for the email", function() {
        expect(u.qInput(this.lock, "email")).to.be.ok();
      });

      it("doesn't show an input for the vcode", function() {
        expect(u.qInput(this.lock, "vcode")).to.not.be.ok();
      });

      it("doesn't invoke the provided callback", function() {
        expect(this.cb.called).to.not.be.ok();
      });

      it("shows a generic error", function() {
        expect(u.isSomethingWrong(this.lock)).to.be.ok();
      });
    });
  });

  describe("submitting an empty vcode", function() {
    before(function() {
      this.lock = u.constructLock();
      this.cb = u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "someone@auth0.com");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
      u.submit(this.lock);
    });

    it("marks the input as invalid", function() {
      expect(u.isInputInvalid(this.lock, "vcode")).to.be.ok();
    });

    it("doesn't perform any request", function() {
      expect(u.startPasswordlessCallCount()).to.be(0);
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
      this.cb = u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "someone@auth0.com");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
      u.fillInput(this.lock, "vcode", "0303456");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("attempts to sign in with the entered cred", function() {
      expect(u.hasSignedInWith("someone@auth0.com", "0303456")).to.be.ok();
    })

    describe("when response arrives", function() {
      before(function(done) {
        setTimeout(() => {
          u.simulateSingInResponse();
          done();
        }, 500);
      });

      it("hides the loading indicator", function() {
        expect(u.isLoading(this.lock)).to.not.be.ok();
      });

      // it("doesn't show an input for the vcode", function() {
      //   expect(u.qInput(this.lock, "vcode")).to.not.be.ok();
      // });

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
      this.cb = u.openLock(this.lock, "emailcode");
      u.fillInput(this.lock, "email", "someone@auth0.com");
      u.submit(this.lock);
      u.simulateStartPasswordlessResponse();
      u.fillInput(this.lock, "vcode", "0303456");
      u.submit(this.lock);
    });

    it("shows a loading indicator until a response is obtained", function() {
      expect(u.isLoading(this.lock)).to.be.ok();
    });

    it("attempts to sign in with the entered cred", function() {
      expect(u.hasSignedInWith("someone@auth0.com", "0303456")).to.be.ok();
    })

    describe("when response arrives", function() {
      before(function() {
        this.error = {description: "invalid email or vcode"};
        u.simulateSingInResponse(this.error);
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
        expect(u.isSomethingWrong(this.lock, this.error.description)).to.be.ok();
      });
    });
  });
});
