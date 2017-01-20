const Path = require('path');
const FS = require('fs');
const querystring = require('querystring');
const Coverage = require('./db/coverage');

const BuildHtml = FS.readFileSync(Path.resolve(__dirname, 'src', 'index.html'));
const BuildJS = FS.readFileSync(Path.resolve(__dirname, 'dist', 'build.js'));
const CSS = FS.readFileSync(Path.resolve(__dirname, 'node_modules', 'psychic-ui', 'dist', 'psychic-min.css'));

const parseBody = (request, response, callback) => {
  var body = '';
  request.on('data', function (data) {
      body += data;
  });
  request.on('end', function () {
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
  '/psychic.css': function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
    response.end(CSS);
  },
  '/build.js': function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/js; charset=utf-8'});
    response.end(BuildJS);
  },
  '/api/v1/upload': function(request, response) {
    switch(request.method) {
      case 'POST':
        parseBody(request, response, function(json) {
          const source_files = json['source_files'];
          const git = json['git'];
          const run_at = json['run_at'];
          const repo_token = json['repo_token'];
          Coverage.save({
              source_files: source_files,
              git: git,
              run_at: run_at,
              repo_token: repo_token
          }).then(function(result) {
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(JSON.stringify(result));
          }).catch(function(err) {
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(JSON.stringify({error: err}));
          });
        });
        break;
      default:
        response.end(ErrorPage);
        break;
    }
  },
  '/api/v1/coverage': function(request, response) {
    Coverage.getAll().then(function(coverages) {
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      response.end(JSON.stringify(coverages));
    }).catch(function(err) {
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      response.end(JSON.stringify({error: err}));
    });
  },
  '/': function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(BuildHtml);
  },
  '/coverage': function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(BuildHtml);
  },
  'default': function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(BuildHtml);
  }
};
