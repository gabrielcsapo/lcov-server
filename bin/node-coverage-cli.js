#!/usr/bin/env node
'use strict';

const program = require('commander');
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');

const lcov = require('../util/lcov');
const git = require('../util/git');
const ci = require('../util/ci');
const directoryHash = require('../util/directoryHash');

program
  .version(require('../package.json').version)
  .option('-u, --url [db]', 'Set the url to upload lcov data too', 'http://localhost:8080')
  .parse(process.argv);

const parsedUrl = url.parse(program.url);

let input = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
    input += chunk;
});
process.stdin.on('end', () => {
    directoryHash([path.resolve(__dirname, '..', 'bin'), path.resolve(__dirname, '..', 'util')], (result) => {
      const env = ci();
      const output = {
          service_job_id: env.service_job_id,
          service_pull_request: env.service_pull_request,
          service_name: env.service_name,
          source_files: [],
          git: {
            git_commit: env.git_commit,
            git_branch: env.git_branch,
            git_committer_name: env.git_committer_name,
            git_committer_email: env.git_committer_email,
            git_message: env.git_message
          },
          hash: result[path.resolve(__dirname, '..', 'util')]['result']['hash'] + result[path.resolve(__dirname, '..', 'bin')]['result']['hash'],
          run_at: new Date()
      };

      lcov.parse(input)
          .then((_lcov) => {
              // Go through and set the file contents
              for (let i = 0; i < _lcov.length; i++) {
                  _lcov[i].source = fs.readFileSync(_lcov[i].file).toString('utf8');
                  _lcov[i].title = _lcov[i].file.substring(_lcov[i].file.lastIndexOf('/') + 1, _lcov[i].file.length);
              }
              output['source_files'] = _lcov;

              git.parse()
                  .then(function(_git) {
                      output['git'] = Object.assign(output['git'], _git);

                      const options = {
                          hostname: parsedUrl.hostname,
                          port: parsedUrl.port || 80,
                          path: '/api/v1/upload',
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          }
                      };
                      let req, operation, data = '';
                      if(parsedUrl.protocol == 'https') {
                        operation = https;
                      } else {
                        operation = http;
                      }
                      req = operation.request(options, (res) => {
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
                  })
                  .catch((err) => {
                      console.log(err); // eslint-disable-line
                  });
          })
          .catch((err) => { throw err; } );
    });
});
