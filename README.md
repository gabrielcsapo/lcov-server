# lcov-server [[docs](https://www.gabrielcsapo.com/lcov-server)][[hosted](https://lcov-server.gabrielcsapo.com)]

> 🎯 A simple lcov server & cli parser

[![Npm Version](https://img.shields.io/npm/v/lcov-server.svg)](https://www.npmjs.com/package/lcov-server)
[![Build Status](https://travis-ci.org/gabrielcsapo/lcov-server.svg?branch=master)](https://travis-ci.org/gabrielcsapo/lcov-server)
[![Coverage Status](https://lcov-server.gabrielcsapo.com/badge/github/gabrielcsapo/lcov-server.svg)](https://lcov-server.gabrielcsapo.com/coverage/github/gabrielcsapo/lcov-server)
[![Dependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/lcov-server/status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/lcov-server)
[![devDependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/lcov-server/dev-status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/lcov-server#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/lcov-server.svg)]()
[![npm](https://img.shields.io/npm/dm/lcov-server.svg)]()

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [lcov-server](#lcov-server)
- [What is this?](#what-is-this)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
	- [Upload](#upload)
	- [Server](#server)

<!-- /TOC -->

# What is this?

It's a lcov server! It stores lcov reports and categorizes them based on their origin repo.

# Prerequisites

- `mongodb` installed
- `nodejs` installed

# Install

```
npm install lcov-server -g
```

# Usage

```
Usage: lcov-server [options]

Commands:

	upload, --upload, -u [server ] Set the url to upload lcov data too (default: http://localhost:8080)
	serve, -s, --serve             Pass this option to startup a lcov-server instance
	version, -v, --version           output the version number
	help, -h, --help              output usage information

Options:

	db, -d, --db [db]           Set the db connection (default: mongodb://localhost:32768/lcov-server)
	parser, -p, --parser <parser>   Set the parser value [lcov, cobertura, golang, jacoco], defaults to lcov (default: lcov)
	basePath, -bp, --basePath <path>  The path that defines the base directory where the files that were covered will be located
```

## Upload

```
tap test --coverage-report=text-lcov | lcov-server --upload http://...
```

## Server

```
lcov-server --serve --db mongodb://localhost:32768/lcov-server
```
