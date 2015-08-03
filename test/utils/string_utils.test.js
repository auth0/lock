import expect from 'expect.js';
import { matches } from '../../src/utils/string_utils';

describe("matching a string", function() {
  it("returns true for a substring, regardless of its capitalization", function() {
    expect(matches("Abc", "aBcd")).to.be(true);
    expect(matches("abC", "zAbc")).to.be(true);
    expect(matches("ABc", "aBCz")).to.be(true);
    expect(matches("abcd", "abc")).to.be(false);
  });
});
