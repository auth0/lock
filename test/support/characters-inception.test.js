var fs = require('fs');
var read = fs.readFileSync;
var path = require('path');
var resolve = path.resolve;
var expect = require('expect.js');

var normal = read(resolve(__dirname, '../../build/auth0-lock.js'));
var minified = read(resolve(__dirname, '../../build/auth0-lock.min.js'));

var altSpace = String.fromCharCode(160);
var altSpaceRegex = new RegExp(altSpace, 'g');

describe('build/auth0-lock.js', function() {
  it('should not have alt+space characters', function(done) {
    // they fail in chrome
    expect(altSpaceRegex.test(normal)).to.be(false);
    done();
  });
});

describe('build/auth0-lock.min.js', function() {
  it('should not have alt+space characters', function(done) {
    // they fail in chrome
    expect(altSpaceRegex.test(minified)).to.be(false);
    done();
  });
});
