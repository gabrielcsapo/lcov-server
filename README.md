# lcov-server

> 🎯 A simple lcov server & cli parser

[![Npm Version](https://img.shields.io/npm/v/lcov-server.svg)](https://www.npmjs.com/package/lcov-server)
[![Build Status](https://travis-ci.org/gabrielcsapo/lcov-server.svg?branch=master)](https://travis-ci.org/gabrielcsapo/lcov-server)
[![Coverage Status](https://lcov-server.herokuapp.com/badge/github/gabrielcsapo/lcov-server.svg)](https://lcov-server.herokuapp.com/coverage/github/gabrielcsapo/lcov-server)
[![Dependency Status](https://david-dm.org/gabrielcsapo/lcov-server.svg)](https://david-dm.org/gabrielcsapo/lcov-server)
[![devDependency Status](https://david-dm.org/gabrielcsapo/lcov-server/dev-status.svg)](https://david-dm.org/gabrielcsapo/lcov-server#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/lcov-server.svg)]()
[![npm](https://img.shields.io/npm/dm/lcov-server.svg)]()

# What is this?

It is a lcov server! It stores lcov reports and categorizes them based on their origin repo.

# Prerequisites

- `mongodb` installed
- `nodejs` installed

# Install

```
npm install lcov-server -g
```

# Usage

> cli

```
tap test --coverage-report=text-lcov | lcov-server-cli
```

> cli:help

```
Usage: lcov-server-cli [options]

Options:

  -h, --help      output usage information
  -V, --version   output the version number
  -u, --url [db]  Set the url to upload lcov data too
```

> server

```
lcov-server
```

> server:help

```
Usage: lcov-server [options]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -d, --db       Set the db connection
```
