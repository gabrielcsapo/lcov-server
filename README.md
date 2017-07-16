# node-coverage-server

[![Greenkeeper badge](https://badges.greenkeeper.io/gabrielcsapo/node-coverage-server.svg)](https://greenkeeper.io/)

[![Npm Version](https://img.shields.io/npm/v/node-coverage-server.svg)](https://www.npmjs.com/package/node-coverage-server)
[![Build Status](https://travis-ci.org/gabrielcsapo/node-coverage-server.svg?branch=master)](https://travis-ci.org/gabrielcsapo/node-coverage-server)
[![Coverage Status](https://node-coverage-server.herokuapp.com/badge/github/gabrielcsapo/node-coverage-server.svg)](https://node-coverage-server.herokuapp.com/coverage/github/gabrielcsapo/node-coverage-server)
[![Dependency Status](https://david-dm.org/gabrielcsapo/node-coverage-server.svg)](https://david-dm.org/gabrielcsapo/node-coverage-server)
[![devDependency Status](https://david-dm.org/gabrielcsapo/node-coverage-server/dev-status.svg)](https://david-dm.org/gabrielcsapo/node-coverage-server#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/node-coverage-server.svg)]()
[![npm](https://img.shields.io/npm/dm/node-coverage-server.svg)]()

# What is this?

It is a lcov server! It stores lcov reports and categorizes them based on their origin repo.

![main screenshot](./screenshots/main.png)

# Install

```
npm install node-coverage-server -g
```

# Usage

> cli

```
tap test --coverage-report=text-lcov | node-coverage-cli
```

> cli:help

```
Usage: node-coverage-cli [options]

Options:

  -h, --help      output usage information
  -V, --version   output the version number
  -u, --url [db]  Set the url to upload lcov data too
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
