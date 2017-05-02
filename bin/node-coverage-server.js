#!/usr/bin/env node

const program = require('commander');
const directoryHash = require('../util/directoryHash');
const path = require('path');

program
  .version(require('../package.json').version)
  .option('-d, --db [db]', 'Set the db connection', 'mongodb://localhost:32768/node-coverage-server')
  .parse(process.argv);

// Set some process variables
process.env.MONGO_URL = program.db;

directoryHash([path.resolve(__dirname, '..', 'bin'), path.resolve(__dirname, '..', 'util')], (result) => {
  process.env.HASH = result[path.resolve(__dirname, '..', 'util')]['result']['hash'] + result[path.resolve(__dirname, '..', 'bin')]['result']['hash'];
});

require('../index');
