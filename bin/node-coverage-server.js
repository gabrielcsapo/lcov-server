#!/usr/bin/env node

var http = require('http');
var fs = require('fs');

var lcov = require('../util/lcov');
var git = require('../util/git');

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

    lcov.parse(input)
        .then(function(_lcov) {
            // Go through and set the file contents
            for (var i = 0; i < _lcov.length; i++) {
                _lcov[i].source = fs.readFileSync(_lcov[i].file).toString('utf8');
                _lcov[i].title = _lcov[i].file.substring(_lcov[i].file.lastIndexOf('/') + 1, _lcov[i].file.length);
            }
            output['source_files'] = _lcov;

            git.parse()
                .then(function(_git) {
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
                        res.on('data', function() {
                            return;
                        });
                    });
                    req.on('error', function(e) {
                        console.error('problem with request: ' + e.message); // eslint-disable-line no-console
                    });
                    req.write(JSON.stringify(output));
                    req.end();
                })
                .catch(function(err) {
                    console.log(err);
                });
        })
        .catch(function(err) {
            throw err;
        });

});
