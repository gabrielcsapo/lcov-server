#!/usr/bin/env node

const program = require('commander');
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');

const lcov = require('../util/lcov');
const git = require('../util/git');
const ci = require('../util/ci');

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
    const env = ci();
    console.log(env);
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
        run_at: new Date(),
        repo_token: ''
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
                    output['git'] = _git;

                    const options = {
                        hostname: parsedUrl.hostname,
                        port: parsedUrl.port || 80,
                        path: '/api/v1/upload',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    };
                    let req;
                    if(parsedUrl.protocol == 'https') {
                      req = https.request(options);
                    } else {
                      req = http.request(options);
                    }
                    req.on('error', (e) => {
                        console.error('problem with request: ' + e.message); // eslint-disable-line
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
