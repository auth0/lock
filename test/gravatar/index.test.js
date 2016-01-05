import expect from 'expect.js';
import { Map } from 'immutable';
import * as g from '../../src/gravatar/index';

const emptyGravatar = new Map({});
const displayName = "someone";
const imageUrl = "https://secure.gravatar.com/avatar/b91fa14e9ce922cc2fdedb2f84dba3a5?d=404";

describe("an empty gravatar", function() {
  it("doesn't have a display name", function() {
    expect(g.displayName(emptyGravatar)).to.be(undefined);
  });

  it("doesn't have an imageUrl", function() {
    expect(g.imageUrl(emptyGravatar)).to.be(undefined);
  });

  it("isn't loaded", function() {
    expect(g.loaded(emptyGravatar)).to.be(false);
  });
});

describe("updating a gravatar", function() {

  describe("setting a display name", function() {
    let gravatarWithDisplayName;

    beforeEach(function() {
      gravatarWithDisplayName = g.setDisplayName(emptyGravatar, displayName);
    });

    it("updates its value", function() {
      expect(g.displayName(gravatarWithDisplayName)).to.be(displayName);
    });

    it("doesn't mark it as loaded", function() {
      expect(g.loaded(gravatarWithDisplayName)).to.be(false);
    });
  });

  describe("setting an image url", function() {
    let gravatarWithImageUrl;

    beforeEach(function() {
      gravatarWithImageUrl = g.setImageUrl(emptyGravatar, imageUrl);
    });

    it("updates its value", function() {
      expect(g.imageUrl(gravatarWithImageUrl)).to.be(imageUrl);
    });

    it("doesn't mark it as loaded", function() {
      expect(g.loaded(gravatarWithImageUrl)).to.be(false);
    });
  });

  describe("setting a display name and a image url", function() {
    let loadedGravatar;

    beforeEach(function() {
      loadedGravatar = g.setDisplayName(emptyGravatar, displayName);
      loadedGravatar = g.setImageUrl(loadedGravatar, imageUrl);
    });

    it("marks it as loaded", function() {
      expect(g.loaded(loadedGravatar)).to.be(true);
    });
  })
});

describe("normalizing an email", function() {
  it("lowercases upercased letters", function() {
    const email = "SomeOne@Auth0.com";
    expect(g.normalizeGravatarEmail(email)).to.be(email.toLowerCase());
  });
});
