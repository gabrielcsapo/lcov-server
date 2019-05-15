const fs = require('fs');
const Path = require('path');
const Url = require('url');
const http = require('http');
const https = require('https');

const lcov = require('../lib/parsers/lcov');
const cobertura = require('../lib/parsers/cobertura');
const golang = require('../lib/parsers/golang');
const jacoco = require('../lib/parsers/jacoco');

const git = require('../lib/git');
const ci = require('../lib/ci');

module.exports = function cli({ parser, input, url, basePath }) {
  const parsedUrl = Url.parse(url);

  return new Promise(async function(resolve, reject) {
    try {
      const info = await git.parse();
      const env = ci();
      const output = {
          service_job_id: env.service_job_id,
          service_pull_request: env.service_pull_request,
          service_name: env.service_name,
          source_files: [],
          git: {
            author_date: info.author_date,
            author_email: info.author_email,
            author_name: info.author_name,
            committer_date: info.committer_date,
            commit: env.commit || info.commit,
            branch: env.branch || info.branch,
            message: env.message || info.message,
            committer_name: env.committer_name || info.committer_name,
            committer_email: env.committer_email || info.committer_email,
            remotes: info.remotes
          },
          run_at: new Date()
      };

      switch(parser) {
        case 'cobertura':
          output['source_files'] = await cobertura.parse(input);
          break;
        case 'golang':
          output['source_files'] = await golang.parse(input);
          break;
        case 'jacoco':
          output['source_files'] = await jacoco.parse(input);
          break;
        default:
          output['source_files'] = await lcov.parse(input);
          break;
      }

      // Go through and set the file contents
      for (let i = 0; i < output['source_files'].length; i++) {
          let path = basePath ? Path.resolve(process.cwd(), basePath, output['source_files'][i].file) : output['source_files'][i].file;

          if(fs.existsSync(path)) {
            output['source_files'][i].source = fs.readFileSync(path).toString('utf8');
            output['source_files'][i].title = output['source_files'][i].file.substring(output['source_files'][i].file.lastIndexOf('/') + 1, output['source_files'][i].file.length);
          } else {
            return reject(`can not find file at ${path}`);
          }
      }

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
    } catch(ex) {
      return reject(ex);
    }
  });
};
