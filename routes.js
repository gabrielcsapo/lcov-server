const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const Coverage = require('./db/coverage');
const Badge = require('openbadge')

const BuildHtml = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
const BuildJS = fs.readFileSync(path.resolve(__dirname, 'dist', 'build.js'));

const parseBody = (req, res, callback) => {
  let body = '';
  req.on('data', (data) => {
      body += data;
  });
  req.on('end', () => {
      switch(req.headers['content-type']) {
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
  '/build.js': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/js; charset=utf-8'} );
    res.end(BuildJS);
  },
  '/api/v1/upload': (req, res) => {
    switch(req.method) {
      case 'POST':
        parseBody(req, res, (json) => {
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
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'} );
            res.end(JSON.stringify(result));
          }).catch((err) => {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
            res.end(JSON.stringify({error: err}));
          });
        });
        break;
      default:
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
          res.end(JSON.stringify({ error: 'incorrect http method' }));
        break;
    }
  },
  '/api/v1/coverage': (req, res) => {
    Coverage.get().then((coverages) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'} );
      res.end(JSON.stringify(coverages));
    }).catch(function(err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
      res.end(JSON.stringify({error: err}));
    });
  },
  '/api/v1/coverage/:repo': (req, res) => {
      let { repo } = req.params;
      // the repo is going to be uri encoded
      repo = decodeURIComponent(repo);

      Coverage.get(repo).then((coverages) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'} );
        res.end(JSON.stringify(coverages));
      }).catch(function(err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8'} );
        res.end(JSON.stringify({error: err}));
      });
  },
  '/:repo.svg': (req, res) => {
    let { repo } = req.params;
    // the repo is going to be uri encoded
    repo = decodeURIComponent(repo);
    Coverage.get(repo).then((coverages) => {
      const coverage = coverages[0];
      const { history } = coverage;
      const lastRun = history[history.length - 1];
      const { lines } = lastRun.source_files[0];
      const percentage = parseInt((lines.hit / lines.found) * 100);
      Badge({text: ['coverage', `${percentage}%`] }, function(err, badgeSvg) {
          res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8'} );
          res.end(badgeSvg);
      });
    }).catch(function(err) {
        Badge({ color: { right: "#b63b3b" }, text: ['coverage', 'not found'] }, function(err, badgeSvg) {
            res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8'} );
            res.end(badgeSvg);
        });
    });
  },
  '/coverage': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'} );
    res.end(BuildHtml);
  },
  'default': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'} );
    res.end(BuildHtml);
  }
};
