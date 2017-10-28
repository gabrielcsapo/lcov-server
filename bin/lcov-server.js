#!/usr/bin/env node

require('babel-polyfill');

const program = require('commander');
const updateNotifier = require('update-notifier');

const cli = require('../lib/cli');

const pkg = require('../package.json');

updateNotifier({pkg}).notify();

program
  .version(pkg.version)
  .option('-u, --upload [server]', 'Set the url to upload lcov data too', 'http://localhost:8080')
  .option('-s, --serve', 'Pass this option to startup a lcov-server instance')
  .option('-d, --db [db]', 'Set the db connection', 'mongodb://localhost:32768/lcov-server')
  .option('-p, --parser <parser>', 'Set the parser value [lcov, cobertura, golang, jacoco], defaults to lcov', 'lcov')
  .option('-bp, --basePath <path>', 'The path that defines the base directory where the files that were covered will be located')
  .parse(process.argv);

const { parser, upload, serve, db, basePath } = program;

if(parser && ['lcov', 'cobertura', 'golang', 'jacoco'].indexOf(parser) === -1) {
  console.error(`parser ${parser} not supported`); // eslint-disable-line
  process.exit(1);
}

if(serve) {
  process.env.MONGO_URL = process.env.MONGO_URL || db;

  require('../index');
} else {
  let input = '';
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
      input += chunk;
  });
  process.stdin.on('end', (async () => {
    try {
      let response = cli({ parser, input, url: upload, basePath });
      if(response.error) {
        console.error(`coverage not sent with reason:\n ${response.error}`); // eslint-disable-line
      } else {
        console.log('\n coverage sent successfully 💚 \n'); // eslint-disable-line
      }
    } catch(ex) {
      console.error(`coverage could not be parsed with reason:\n ${ex.toString()}`); // eslint-disable-line
    }
  }));
}
