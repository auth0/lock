var s = require('semver').parse(require('../../package.json').version); 
if (!s.prerelease.length) { 
  console.log([s.major,s.minor].join('.'));
}