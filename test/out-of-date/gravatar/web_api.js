import expect from 'expect.js'
import { spy, stub } from 'sinon';
import * as api from '../../src/gravatar/web_api';
import jsonp from '../../src/utils/jsonp_utils';

const email = "someone@auth0.com";
const emailMD5 = "b91fa14e9ce922cc2fdedb2f84dba3a5";
const invalidEmail = "invalidEmail";
let fail, success;

describe("fetching image", function() {
  let img;

  // TODO: stub preload.img and add tests for preload.
  function getCallback(name) {
    for (var i = 0; i < img.addEventListener.callCount; i++) {
      if (img.addEventListener.getCall(i).args[0] == name) {
        return img.addEventListener.getCall(i);
      }
    }
  }

  function invokeCallback(name) {
    const args = [name === "error" ? {} : undefined];
    return getCallback(name).args[1].apply(undefined, args);
  }

  beforeEach(function() {
    img = { addEventListener: spy() };
    stub(global.document, "createElement").returns(img);
    success = spy();
    fail = spy();
  });

  afterEach(function() {
    global.document.createElement.restore();
  });

  describe("for an invalid email", function() {
    beforeEach(function() {
      api.img(invalidEmail, success, fail);
    });

    it("invokes the 'fail' callback", function() {
      expect(fail.calledOnce).to.be(true);
      expect(fail.calledWithExactly(invalidEmail)).to.be(true);

    });
  });

  describe("for a valid email", function() {
    beforeEach(function() {
      api.img(email, success, fail);
    });

    it("constructs the expected URL", function() {
      const url = `https://secure.gravatar.com/avatar/${emailMD5}?d=404`;
      expect(img.src).to.be(url);
    });

    it("setups a 'load' and a 'error' callback", function() {
      expect(img.addEventListener.calledTwice).to.be(true);
      expect(img.addEventListener.withArgs("load").calledOnce).to.be(true);
      expect(img.addEventListener.withArgs("error").calledOnce).to.be(true);
    });

    describe("with an associated Gravatar image", function() {
      beforeEach(function() {
        invokeCallback("load");
      });

      it("invokes the 'success' callback with `email` and `img`", function() {
        expect(success.calledOnce).to.be(true);
        expect(success.calledWithExactly(email, img)).to.be(true)
      });
    });

    describe("without an associated Gravatar image", function() {
      beforeEach(function() {
        invokeCallback("error");
      });

      it("invokes the 'fail' callback with `email`", function() {
        expect(fail.calledOnce).to.be(true);
        expect(fail.calledWithExactly(email)).to.be(true)
      });
    });
  });
});

describe("fetching profile", function() {
  const email = "someone@auth0.com";
  const emailMD5 = "b91fa14e9ce922cc2fdedb2f84dba3a5";
  const invalidEmail = "invalidEmail";

  function invokeCallback(err, obj) {
    return jsonp.get.lastCall.args[1].call(undefined, err, obj);
  }

  beforeEach(function() {
    success = spy();
    fail = spy();
    stub(jsonp, "get");
  });

  afterEach(function() {
    jsonp.get.restore();
  });

  describe("for an invalid email", function() {
    beforeEach(function() {
      api.profile(invalidEmail, success, fail);
    });

    it("invokes the 'fail' callback", function() {
      expect(fail.calledOnce).to.be(true);
      expect(fail.calledWithExactly(invalidEmail)).to.be(true);
    });
  });

  describe("for a valid email", function() {
    beforeEach(function() {
      api.profile(email, success, fail);
    });

    it("performs a request to the expected URL", function() {
      const url = `https://secure.gravatar.com/${emailMD5}.json`;
      expect(jsonp.get.calledOnce).to.be(true);
      expect(jsonp.get.withArgs(url).calledOnce).to.be(true);
    });

    describe("with an associated Gravatar profile", function() {
      const response = {entry: [{someAttr: "someAttr"}]};

      beforeEach(function() {
        invokeCallback(null, response);
      });

      it("invokes the 'success' callback with `email` and `img`", function() {
        expect(success.calledOnce).to.be(true);
        expect(success.calledWithExactly(email, response.entry[0])).to.be(true)
      });
    });

    describe("with an associated empty Gravatar profile", function() {
      const response = {entry: []};

      beforeEach(function() {
        invokeCallback(null, response);
      });

      it("invokes the 'success' callback with `email` and `img`", function() {
        expect(fail.calledOnce).to.be(true);
        expect(fail.calledWithExactly(email)).to.be(true)
      });
    });

    describe("without an associated Gravatar profile", function() {
      const error = {code: "someCode"};

      beforeEach(function() {
        invokeCallback(error);
      });

      it("invokes the 'fail' callback with `email`", function() {
        expect(fail.calledOnce).to.be(true);
        expect(fail.calledWithExactly(email, error)).to.be(true)
      });
    });
  });
});
