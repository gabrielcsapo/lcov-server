const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const Coverage = require('./db/coverage');

const BuildHtml = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
const BuildJS = fs.readFileSync(path.resolve(__dirname, 'dist', 'build.js'));

const parseBody = (request, response, callback) => {
  var body = '';
  request.on('data', (data) => {
      body += data;
  });
  request.on('end', () => {
      switch(request.headers['content-type']) {
        case 'application/x-www-form-urlencoded':
          callback(querystring.parse(decodeURI(body)));
          break;
        case 'application/json':
          callback(JSON.parse(body));
          break;
        default:
          callback(body);
          break;
      }
  });
};

module.exports = {
  '/build.js': (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/js; charset=utf-8'} );
    response.end(BuildJS);
  },
  '/api/v1/upload': (request, response) => {
    switch(request.method) {
      case 'POST':
        parseBody(request, response, (json) => {
          const source_files = json['source_files'];
          const git = json['git'];
          const run_at = json['run_at'];
          const repo_token = json['repo_token'];
          Coverage.save({
              source_files: source_files,
              git: git,
              run_at: run_at,
              repo_token: repo_token
          }).then((result) => {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'} );
            response.end(JSON.stringify(result));
          }).catch((err) => {
            response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
            response.end(JSON.stringify({error: err}));
          });
        });
        break;
      default:
          response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
          response.end(JSON.stringify({ error: 'incorrect http method' }));
        break;
    }
  },
  '/api/v1/coverage': (request, response) => {
    Coverage.getAll().then((coverages) => {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'} );
      response.end(JSON.stringify(coverages));
    }).catch(function(err) {
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
      response.end(JSON.stringify({error: err}));
    });
  },
  '/': (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'} );
    response.end(BuildHtml);
  },
  '/coverage': (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'} );
    response.end(BuildHtml);
  },
  'default': (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'} );
    response.end(BuildHtml);
  }
};
