#!/usr/bin/env node

const program = require('commander');

program
  .version(require('../package.json').version)
  .option('-d, --db [db]', 'Set the db connection', 'mongodb://localhost:32768/node-coverage-server')
  .parse(process.argv);

// Set some process variables
process.env.MONGO_URL = program.db;

require('../index');
