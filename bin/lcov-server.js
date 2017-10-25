#!/usr/bin/env node

require('babel-polyfill');

const program = require('commander');
const http = require('http');
const https = require('https');
const fs = require('fs');
const Path = require('path');
const Url = require('url');
const updateNotifier = require('update-notifier');

const lcov = require('../lib/lcov');
const cobertura = require('../lib/cobertura');
const golang = require('../lib/golang');
const jacoco = require('../lib/jacoco');

const git = require('../lib/git');
const ci = require('../lib/ci');

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
  const parsedUrl = Url.parse(upload);

  let input = '';
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
      input += chunk;
  });
  process.stdin.on('end', (async () => {
    const env = ci();
    const output = {
        service_job_id: env.service_job_id,
        service_pull_request: env.service_pull_request,
        service_name: env.service_name,
        source_files: [],
        git: {
          commit: env.commit,
          branch: env.branch,
          message: env.message,
          committer_name: env.committer_name,
          committer_email: env.committer_email
        },
        run_at: new Date()
    };

    let _lcov = {};
    switch(parser) {
      case 'lcov':
        _lcov = await lcov.parse(input);
        break;
      case 'cobertura':
        _lcov = await cobertura.parse(input);
        break;
      case 'golang':
        _lcov = await golang.parse(input);
        break;
      case 'jacoco':
        _lcov = await jacoco.parse(input);
        break;
    }

    const _git = await git.parse();

    // Go through and set the file contents
    for (let i = 0; i < _lcov.length; i++) {
        let path = basePath ? Path.resolve(process.cwd(), basePath, _lcov[i].file) : _lcov[i].file;

        _lcov[i].source = fs.readFileSync(path).toString('utf8');
        _lcov[i].title = _lcov[i].file.substring(_lcov[i].file.lastIndexOf('/') + 1, _lcov[i].file.length);
    }

    output['source_files'] = _lcov;
    output['git'] = Object.assign(output['git'], _git);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: '/api/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let operation = http;
    let data = '';

    if(parsedUrl.protocol == 'https:') {
      options.port = 443;
      operation = https;
    }

    let req = operation.request(options, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if(response.error) {
            console.error(response.error); // eslint-disable-line
          } else {
            console.log(`\n coverage sent successfully 💚 \n`); // eslint-disable-line
          }
        } catch(ex) {
          console.log(`\n uhoh something went wrong, ${ex.toString()}`); // eslint-disable-line
        }
      });
    });
    req.write(JSON.stringify(output));
    req.end();
  }));
}
