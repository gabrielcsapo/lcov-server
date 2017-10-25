#!/usr/bin/env node

const semver = require('semver');

if (semver.lt(process.version, '8.5.0')) {
  // only shim pre 8 binaries
  require('babel-polyfill');
  require('babel-register');
}

require('./index.js');
