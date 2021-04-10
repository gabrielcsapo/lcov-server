#!/usr/bin/env node

require('babel-polyfill');

const updateNotifier = require('update-notifier');

const cli = require('../lib/cli');

const pkg = require('../package.json');

updateNotifier({pkg}).notify();

const args = process.argv.slice(2);

let program = {};

args.forEach((a, i) => {
  switch(a) {
  case '-v':
  case '--version':
      console.log(`v${require('../package.json').version}`); // eslint-disable-line
      process.exit(0);
    break;
  case 'help':
  case '-h':
  case '--help':
    console.log(``+ // eslint-disable-line
  `
    Usage: lcov-server [options]

    Commands:

      upload, --upload, -u [server ] Set the url to upload lcov data too (default: http://localhost:8080)
      serve, -s, --serve             Pass this option to startup a lcov-server instance
      version, -v, --version           output the version number
      help, -h, --help              output usage information

    Options:

      db, -d, --db [db]           Set the db connection (default: postgres://localhost:5432/lcov-server)
      parser, -p, --parser <parser>   Set the parser value [lcov, cobertura, golang, jacoco], defaults to lcov (default: lcov)
      basePath, -bp, --basePath <path>  The path that defines the base directory where the files that were covered will be located
  `);
    process.exit(0);
    break;
    case '-db':
    case '--db':
    case 'db':
      program.db = args[i + 1];
    break;
    case '-u':
    case '--upload':
    case 'upload':
      program.upload = args[i + 1];
    break;
    case '-s':
    case '--serve':
    case 'serve':
      program.serve = true;
    break;
    case '-p':
    case '--parser':
    case 'parser':
      program.parser = args[i + 1];
      if(['lcov', 'cobertura', 'golang', 'jacoco'].indexOf(program.parser) === -1) {
        console.error(`parser ${program.parser} not supported`); // eslint-disable-line
        process.exit(1);
      }
    break;
    case '-bp':
    case '--basePath':
    case 'basePath':
      program.basePath = args[i + 1];
    break;
  }
});

const { parser, upload, serve, db, basePath } = program;

if(serve) {
  process.env.DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || db || 'postgres://localhost:5432/lcov-server';

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
      let response = await cli({ parser, input, url: upload, basePath });

      if(response.error) {
        console.error(`\n coverage not sent with reason:\n ${response.error}\n`); // eslint-disable-line
      } else {
        console.log('\n coverage sent successfully 💚 \n'); // eslint-disable-line
      }
    } catch(ex) {
      console.log(ex);
      console.error(`\n coverage could not be parsed with reason:\n ${ex.toString()}\n`); // eslint-disable-line
    }
  }));
}
