#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const lockfilePath = path.resolve(__dirname, '..', 'package-lock.json');

let lock;
try {
  const rfd = fs.openSync(lockfilePath, 'r');
  const content = fs.readFileSync(rfd, 'utf8');
  fs.closeSync(rfd);
  lock = JSON.parse(content);
} catch (e) {
  if (e.code === 'ENOENT') process.exit(0);
  throw e;
}

// lockfile v2/v3 — flat packages map
if (lock.packages) {
  Object.values(lock.packages).forEach(pkg => delete pkg.resolved);
}

// lockfile v1 — nested dependencies
function stripDeps(deps) {
  if (!deps) return;
  Object.values(deps).forEach(dep => {
    delete dep.resolved;
    stripDeps(dep.dependencies);
  });
}
stripDeps(lock.dependencies);

const wfd = fs.openSync(lockfilePath, 'w');
fs.writeFileSync(wfd, JSON.stringify(lock, null, 2) + '\n');
fs.closeSync(wfd);
console.log('Stripped resolved fields from package-lock.json');
