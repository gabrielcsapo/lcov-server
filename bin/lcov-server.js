#!/usr/bin/env node

const program = require('commander');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

updateNotifier({pkg}).notify();

program
  .version(pkg.version)
  .option('-d, --db [db]', 'Set the db connection', 'mongodb://localhost:32768/lcov-server')
  .parse(process.argv);

process.env.MONGO_URL = process.env.MONGO_URL || program.db;

require('../index');
