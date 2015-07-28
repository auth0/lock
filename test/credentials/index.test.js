import expect from 'expect.js';
import Immutable from 'immutable';
import * as c from '../../src/credentials/index';

let emptyEntity = Immutable.fromJS({});

const invalidPhoneNumber = "abc";
const phoneNumber = "0303456";

describe("setting a phone number", function() {
  let entity;

  describe("when is valid", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, phoneNumber);
    });

    it("updates the phone number", function() {
      expect(c.phoneNumber(entity)).to.be(phoneNumber);
    });

    it("marks the phone number as valid", function() {
      expect(c.validPhoneNumber(entity)).to.be(true);
    });

    it("unmarks the phone number as visibly invalid", function() {
      expect(c.visiblyInvalidPhoneNumber(entity)).to.be(false);
    });
  });

  describe("when is invalid", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, invalidPhoneNumber);
    });

    it("updates the phone number", function() {
      expect(c.phoneNumber(entity)).to.be(invalidPhoneNumber);
    });

    it("unmarks the phone number as valid", function() {
      expect(c.validPhoneNumber(entity)).to.be(false);
    });
  });

  describe("when marked as visibly invalid", function() {
    beforeEach(function() {
      entity = c.setShowInvalidPhoneNumber(emptyEntity, true);
    });

    describe("and is valid", function() {
      beforeEach(function() {
        entity = c.setPhoneNumber(entity, phoneNumber);
      });

      it("unmarks the phone number as visibly invalid", function() {
        expect(c.visiblyInvalidPhoneNumber(entity)).to.be(false);
      });
    });

    describe("and is invalid", function() {
      beforeEach(function() {
        entity = c.setPhoneNumber(entity, invalidPhoneNumber);
      });

      it("keeps the phone number marked as visibly invalid", function() {
        expect(c.visiblyInvalidPhoneNumber(entity)).to.be(true);
      });
    });
  });
});

describe("validating a phone number", function() {
  let entity;

  it("success when there is at least one number", function() {
    entity = c.setPhoneNumber(emptyEntity, "1");
    expect(c.validPhoneNumber(entity)).to.be(true);
  });

  it("success when there are at most fourteen numbers", function() {
    entity = c.setPhoneNumber(emptyEntity, "12345678901234");
    expect(c.validPhoneNumber(entity)).to.be(true);
  });

  it("fails when it is the empty string", function() {
    entity = c.setPhoneNumber(emptyEntity, "");
    expect(c.validPhoneNumber(entity)).to.be(false);
  });

  it("fails when there are letters", function() {
    entity = c.setPhoneNumber(emptyEntity, "123a456");
    expect(c.validPhoneNumber(entity)).to.be(false);
  });

  it("fails when there are more than 14 numbers", function() {
    entity = c.setPhoneNumber(emptyEntity, "123456789012345");
    expect(c.validPhoneNumber(entity)).to.be(false);
  });
});

describe("accessing a phone number", function() {
  let entity;

  describe("when is set", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, phoneNumber);
    });

    it("returns the number", function() {
      expect(c.phoneNumber(entity)).to.be(phoneNumber);
    });
  });

  describe("when is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.phoneNumber(entity)).to.be("");
    });
  });
});


const countryCode = "+54";

describe("accessing a country code", function() {
  let entity;

  describe("when is set", function() {
    beforeEach(function() {
      entity = c.setCountryCode(emptyEntity, countryCode);
    });

    it("returns the country code", function() {
      expect(c.countryCode(entity)).to.be(countryCode);
    });
  });

  describe("when is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.countryCode(entity)).to.be("");
    });
  });
});

describe("accessing a full phone number", function() {
  let entity;

  describe("when the country code and the number are set", function() {
    beforeEach(function() {
      entity = c.setCountryCode(emptyEntity, countryCode);
      entity = c.setPhoneNumber(entity, phoneNumber);
    });

    it("returns the country code concatenated with the number", function() {
      expect(c.fullPhoneNumber(entity)).to.be(countryCode + phoneNumber);
    });
  });

  describe("when the country code is set but the number is not", function() {
    beforeEach(function() {
      entity = c.setCountryCode(emptyEntity, countryCode);
    });

    it("returns the number", function() {
      expect(c.fullPhoneNumber(entity)).to.be(countryCode);
    });
  });

  describe("when the country code is not set but the number is", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, phoneNumber);
    });

    it("returns the number", function() {
      expect(c.fullPhoneNumber(entity)).to.be(phoneNumber);
    });
  });

  describe("when the country code and the phone number are not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.fullPhoneNumber(entity)).to.be("");
    });
  });
});

const invalidEmail = "abc";
const email = "someone@auth0.com";

describe("setting an email", function() {
  let entity;

  describe("when is valid", function() {
    beforeEach(function() {
      entity = c.setEmail(emptyEntity, email);
    });

    it("updates the email", function() {
      expect(c.email(entity)).to.be(email);
    });

    it("marks the email as valid", function() {
      expect(c.validEmail(entity)).to.be(true);
    });

    it("unmarks the email as visibly invalid", function() {
      expect(c.visiblyInvalidEmail(entity)).to.be(false);
    });
  });

  describe("when is invalid", function() {
    beforeEach(function() {
      entity = c.setEmail(emptyEntity, invalidEmail);
    });

    it("updates the email", function() {
      expect(c.email(entity)).to.be(invalidEmail);
    });

    it("unmarks the email as valid", function() {
      expect(c.validEmail(entity)).to.be(false);
    });
  });

  describe("when marked as visibly invalid", function() {
    beforeEach(function() {
      entity = c.setShowInvalidEmail(emptyEntity, true);
    });

    describe("and is valid", function() {
      beforeEach(function() {
        entity = c.setEmail(entity, email);
      });

      it("unmarks the email as visibly invalid", function() {
        expect(c.visiblyInvalidEmail(entity)).to.be(false);
      });
    });

    describe("and is invalid", function() {
      beforeEach(function() {
        entity = c.setEmail(entity, invalidEmail);
      });

      it("keeps the email marked as visibly invalid", function() {
        expect(c.visiblyInvalidEmail(entity)).to.be(true);
      });
    });
  });
});

describe("validating an email", function() {
  let entity;

  it("success when it contains all of its parts", function() {
    entity = c.setEmail(emptyEntity, "someone@auth0.com");
    expect(c.validEmail(entity)).to.be(true);
  });

  it("fails when the @ is missing", function() {
    entity = c.setEmail(emptyEntity, "someoneauth0.com");
    expect(c.validEmail(entity)).to.be(false);
  });

  it("fails when it is the empty string", function() {
    entity = c.setEmail(emptyEntity, "");
    expect(c.validEmail(entity)).to.be(false);
  });

  it("fails when the local part is missing", function() {
    entity = c.setEmail(emptyEntity, "@auth0.com");
    expect(c.validEmail(entity)).to.be(false);
  });

  it("fails when the domain is missing", function() {
    entity = c.setEmail(emptyEntity, "someone@");
    expect(c.validEmail(entity)).to.be(false);
  });

  it("fails when the domain is incomplete", function() {
    entity = c.setEmail(emptyEntity, "someone@auth0.c");
    expect(c.validEmail(entity)).to.be(false);
  });
});

describe("accessing an email", function() {
  let entity;

  describe("when is set", function() {
    beforeEach(function() {
      entity = c.setEmail(emptyEntity, email);
    });

    it("returns the email", function() {
      expect(c.email(entity)).to.be(email);
    });
  });

  describe("when is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.email(entity)).to.be("");
    });
  });
});


const invalidVerificationCode = "";
const verificationCode = "123456";

describe("setting a verification code", function() {
  let entity;

  describe("when is valid", function() {
    beforeEach(function() {
      entity = c.setVerificationCode(emptyEntity, verificationCode);
    });

    it("updates the verification code", function() {
      expect(c.verificationCode(entity)).to.be(verificationCode);
    });

    it("marks the verification code as valid", function() {
      expect(c.validVerificationCode(entity)).to.be(true);
    });

    it("unmarks the verification code as visibly invalid", function() {
      expect(c.visiblyInvalidVerificationCode(entity)).to.be(false);
    });
  });

  describe("when is invalid", function() {
    beforeEach(function() {
      entity = c.setVerificationCode(emptyEntity, invalidVerificationCode);
    });

    it("updates the verification code", function() {
      expect(c.verificationCode(entity)).to.be(invalidVerificationCode);
    });

    it("unmarks the verification code as valid", function() {
      expect(c.validVerificationCode(entity)).to.be(false);
    });
  });

  describe("when marked as visibly invalid", function() {
    beforeEach(function() {
      entity = c.setShowInvalidVerificationCode(emptyEntity, true);
    });

    describe("and is valid", function() {
      beforeEach(function() {
        entity = c.setVerificationCode(entity, verificationCode);
      });

      it("unmarks the verification code as visibly invalid", function() {
        expect(c.visiblyInvalidVerificationCode(entity)).to.be(false);
      });
    });

    describe("and is invalid", function() {
      beforeEach(function() {
        entity = c.setVerificationCode(entity, invalidVerificationCode);
      });

      it("keeps the verification code marked as visibly invalid", function() {
        expect(c.visiblyInvalidVerificationCode(entity)).to.be(true);
      });
    });
  });
});

describe("validating a verification code", function() {
  let entity;

  it("success when there is at least one character", function() {
    entity = c.setVerificationCode(emptyEntity, "a");
    expect(c.validVerificationCode(entity)).to.be(true);
  });

  it("fails when it is the empty string", function() {
    entity = c.setVerificationCode(emptyEntity, "");
    expect(c.validVerificationCode(entity)).to.be(false);
  });
});

describe("accessing a verification code", function() {
  let entity;

  describe("when is set", function() {
    beforeEach(function() {
      entity = c.setVerificationCode(emptyEntity, verificationCode);
    });

    it("returns the verification code", function() {
      expect(c.verificationCode(entity)).to.be(verificationCode);
    });
  });

  describe("when is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.verificationCode(entity)).to.be("");
    });
  });
});
