import expect from 'expect.js';
import * as idu from '../../src/utils/id_utils';
import { Set } from 'immutable';

describe("building a set of random ids", function() {
  const count = 10;
  let subject;

  before(function() {
    subject = new Set();
    for (let i = 0; i < 10; i++) {
      subject = subject.add(idu.random());
    }
  })

  it("is always a string", function() {
    expect(subject.every(x => typeof x === "string")).to.be(true);
  });

  it("always contains only lowercase letters and numbers", function() {
    expect(subject.every(x => /[a-z0-9]+/.test(x))).to.be(true);
  });

  it("returns a new value every time", function() {
    expect(subject.size).to.be(10);
  });
});
