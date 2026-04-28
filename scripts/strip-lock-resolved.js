#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const lockfilePath = path.resolve(__dirname, '..', 'package-lock.json');

if (!fs.existsSync(lockfilePath)) {
  process.exit(0);
}

const lock = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));

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

fs.writeFileSync(lockfilePath, JSON.stringify(lock, null, 2) + '\n');
console.log('Stripped resolved fields from package-lock.json');
