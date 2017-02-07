# node-coverage-server

[![Npm Version](https://img.shields.io/npm/v/node-coverage-server.svg)](https://www.npmjs.com/package/node-coverage-server)
[![Build Status](https://travis-ci.org/gabrielcsapo/node-coverage-server.svg?branch=master)](https://travis-ci.org/gabrielcsapo/node-coverage-server)
[![Coverage Status](https://coveralls.io/repos/github/gabrielcsapo/node-coverage-server/badge.svg?branch=master)](https://coveralls.io/github/gabrielcsapo/node-coverage-server?branch=master)
[![Dependency Status](https://david-dm.org/gabrielcsapo/node-coverage-server.svg)](https://david-dm.org/gabrielcsapo/node-coverage-server)
[![devDependency Status](https://david-dm.org/gabrielcsapo/node-coverage-server/dev-status.svg)](https://david-dm.org/gabrielcsapo/node-coverage-server#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/node-coverage-server.svg)]()
[![npm](https://img.shields.io/npm/dm/node-coverage-server.svg)]()

# What is this?

It is a lcov server! It stores lcov reports and categorizes them based on their origin repo. 

# Install

```
npm install node-coverage-server -g
```

# Usage

> cli

```
tap test --coverage-report=text-lcov | node-coverage-cli
```

> server

```
Usage: node-coverage-server [options]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -d, --db       Set the db connection
```

# Prerequisites

- mongodb installed
- nodejs installed
