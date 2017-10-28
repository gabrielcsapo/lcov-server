const fs = require('fs');
const Path = require('path');
const Url = require('url');
const http = require('http');
const https = require('https');

const lcov = require('../lib/lcov');
const cobertura = require('../lib/cobertura');
const golang = require('../lib/golang');
const jacoco = require('../lib/jacoco');

const git = require('../lib/git');
const ci = require('../lib/ci');

module.exports = function cli({ parser, input, url, basePath }) {
  const parsedUrl = Url.parse(url);

  return new Promise(async function(resolve, reject) {
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
      case 'cobertura':
        _lcov = await cobertura.parse(input);
        break;
      case 'golang':
        _lcov = await golang.parse(input);
        break;
      case 'jacoco':
        _lcov = await jacoco.parse(input);
        break;
      default:
        _lcov = await lcov.parse(input);
        break;
    }

    // Go through and set the file contents
    for (let i = 0; i < _lcov.length; i++) {
        let path = basePath ? Path.resolve(process.cwd(), basePath, _lcov[i].file) : _lcov[i].file;

        if(fs.existsSync(path)) {
          _lcov[i].source = fs.readFileSync(path).toString('utf8');
          _lcov[i].title = _lcov[i].file.substring(_lcov[i].file.lastIndexOf('/') + 1, _lcov[i].file.length);
        } else {
          return reject(`can not find file at ${path}`);
        }
    }

    output['source_files'] = _lcov;
    output['git'] = Object.assign(output['git'], await git.parse());

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
            return reject(response.error); // eslint-disable-line
          } else {
            return resolve(response);
          }
        } catch(ex) {
          return reject(ex);
        }
      });
    });
    req.write(JSON.stringify(output));
    req.end();
  });
};
