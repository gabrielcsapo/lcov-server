#!/usr/bin/env node

var lcov = require('../util/lcov');
var git = require('../util/git');
var http = require('http');
var fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var input = '';

process.stdin.on('data', function(chunk) {
    input += chunk;
});

process.stdin.on('end', function() {
    const output = {
        source_files: [],
        git: {},
        run_at: new Date(),
        repo_token: ''
    };

    lcov.parse(input, function(err, _lcov) {
        if (err) {
            throw err;
        }
        // Go through and set the file contents
        for(var i = 0; i < _lcov.length; i++) {
          _lcov[i].source = fs.readFileSync(_lcov[i].file).toString('utf8');
          _lcov[i].title = _lcov[i].file.substring(_lcov[i].file.lastIndexOf('/') + 1, _lcov[i].file.length);
        }
        output['source_files'] = _lcov;

        git(function(err, _git) {
            if (err) {
                throw err;
            }
            output['git'] = _git;

            var req = http.request({
              hostname: 'localhost',
              port: 5000,
              path: '/api/v1/upload',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              }
            }, function(res) {
              res.setEncoding('utf8');
              res.on('data', function () {
                return;
              });
            });
            req.on('error', function(e) {
              console.error('problem with request: ' + e.message); // eslint-disable-line no-console
            });
            req.write(JSON.stringify(output));
            req.end();
        });
    });
});
