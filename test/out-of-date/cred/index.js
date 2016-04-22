import expect from 'expect.js';
import Immutable from 'immutable';
import * as c from '../../src/field/index';
import * as cc from '../../src/field/country_codes';

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

      it("unmarks the phone number as visibly invalid", function() {
        expect(c.visiblyInvalidPhoneNumber(entity)).to.be(false);
      });
    });
  });
});

describe("validating a phone number", function() {
  let entity;

  it("fails when there is just one number", function() {
    entity = c.setPhoneNumber(emptyEntity, "1");
    expect(c.validPhoneNumber(entity)).to.be(false);
  });

  it("success when there is at least two numbers", function() {
    entity = c.setPhoneNumber(emptyEntity, "12");
    expect(c.validPhoneNumber(entity)).to.be(true);
  });

  it("success when there are spaces or hyphens between numbers", function() {
    entity = c.setPhoneNumber(emptyEntity, "123 4567-8901");
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


const location =  cc.countryCodes.first();

describe("accessing a dialing code", function() {
  let entity;

  describe("when a location is set", function() {
    beforeEach(function() {
      entity = c.setPhoneLocation(emptyEntity, location);
    });

    it("returns the location's dialing code", function() {
      expect(c.phoneDialingCode(entity)).to.be(cc.dialingCode(location));
      expect(cc.dialingCode(location)).to.not.be(cc.dialingCode(cc.defaultLocation)); // sanity check
    });
  });

  describe("when a location is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the default dialing code", function() {
      expect(c.phoneDialingCode(entity)).to.be(cc.dialingCode(cc.defaultLocation));
    });
  });
});

describe("accessing a full phone number", function() {
  let entity;

  describe("when the phone number is set", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, phoneNumber);
    });

    it("returns the dialing code concatenated with the number", function() {
      expect(c.fullPhoneNumber(entity)).to.be(c.phoneDialingCode(entity) + c.phoneNumber(entity));
    });
  });

  describe("when the phone number is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the dialing code", function() {
      expect(c.fullPhoneNumber(entity)).to.be(c.phoneDialingCode(entity));
    });
  });
});

describe("accessing a human readable full phone number", function() {
  let entity;

  describe("when the phone number is set", function() {
    beforeEach(function() {
      entity = c.setPhoneNumber(emptyEntity, phoneNumber);
    });

    it("returns the dialing code separated from the number", function() {
      expect(c.fullHumanPhoneNumber(entity)).to.be(`${c.phoneDialingCode(entity)} ${c.phoneNumber(entity)}`);
    });
  });

  describe("when the phone number is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the dialing code and a space", function() {
      expect(c.fullHumanPhoneNumber(entity)).to.be(`${c.phoneDialingCode(entity)} `);
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

      it("unmarks the email as visibly invalid", function() {
        expect(c.visiblyInvalidEmail(entity)).to.be(false);
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


const invalidVcode = "";
const vcode = "123456";

describe("setting a vcode", function() {
  let entity;

  describe("when is valid", function() {
    beforeEach(function() {
      entity = c.setVcode(emptyEntity, vcode);
    });

    it("updates the vcode", function() {
      expect(c.vcode(entity)).to.be(vcode);
    });

    it("marks the vcode as valid", function() {
      expect(c.validVcode(entity)).to.be(true);
    });

    it("unmarks the vcode as visibly invalid", function() {
      expect(c.visiblyInvalidVcode(entity)).to.be(false);
    });
  });

  describe("when is invalid", function() {
    beforeEach(function() {
      entity = c.setVcode(emptyEntity, invalidVcode);
    });

    it("updates the vcode", function() {
      expect(c.vcode(entity)).to.be(invalidVcode);
    });

    it("unmarks the vcode as valid", function() {
      expect(c.validVcode(entity)).to.be(false);
    });
  });

  describe("when marked as visibly invalid", function() {
    beforeEach(function() {
      entity = c.setShowInvalidVcode(emptyEntity, true);
    });

    describe("and is valid", function() {
      beforeEach(function() {
        entity = c.setVcode(entity, vcode);
      });

      it("unmarks the vcode as visibly invalid", function() {
        expect(c.visiblyInvalidVcode(entity)).to.be(false);
      });
    });

    describe("and is invalid", function() {
      beforeEach(function() {
        // TODO: We need to perform a value change but the only invalid code is
        // the empty string.
        entity = c.setVcode(entity, "1");
        entity = c.setShowInvalidVcode(entity, true);

        entity = c.setVcode(entity, invalidVcode);
      });

      it("unmarks the vcode as visibly invalid", function() {
        expect(c.visiblyInvalidVcode(entity)).to.be(false);
      });
    });
  });
});

describe("validating a vcode", function() {
  let entity;

  it("success when there is at least one character", function() {
    entity = c.setVcode(emptyEntity, "a");
    expect(c.validVcode(entity)).to.be(true);
  });

  it("fails when it is the empty string", function() {
    entity = c.setVcode(emptyEntity, "");
    expect(c.validVcode(entity)).to.be(false);
  });
});

describe("accessing a vcode", function() {
  let entity;

  describe("when is set", function() {
    beforeEach(function() {
      entity = c.setVcode(emptyEntity, vcode);
    });

    it("returns the vcode", function() {
      expect(c.vcode(entity)).to.be(vcode);
    });
  });

  describe("when is not set", function() {
    beforeEach(function() {
      entity = emptyEntity;
    });

    it("returns the empty string", function() {
      expect(c.vcode(entity)).to.be("");
    });
  });
});
