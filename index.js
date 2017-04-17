const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const express = require('express');
const Badge = require('openbadge');
const parse = require('git-url-parse');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const app = express();
const Coverage = require('./db/coverage');
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

const port = process.env.PORT || 8080;

const html = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
const js = fs.readFileSync(path.resolve(__dirname, 'dist', 'build.js'));

app.post('/api/v1/upload', (req, res) => {
  parseBody(req, res, (json) => {
    let {
      git,
      run_at,
      repo_token,
      source_files,
      service_job_id,
      service_pull_request,
      service_name
    } = json;

    // Make sure the remote url is set correctly
    git.remotes.url = parse(parse(git.remotes.url).toString("ssh")).toString("https");

    Coverage.save({
        source_files,
        git,
        run_at,
        repo_token,
        service_job_id,
        service_pull_request,
        service_name
    }).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500);
      res.send({error: err});
    });
  });
});

app.get('/api/v1/coverage', (req, res) => {
  Coverage.get()
    .then((coverages) => {
      res.send(coverages);
    }).catch(function(err) {
      res.status(500);
      res.send({error: err});
    });
});

app.get('/api/v1/coverage/:service/:owner', (req, res) => {
  const { service, owner } = req.params;

  Coverage.get(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/`))
    .then((coverages) => {
      res.send(coverages);
    }).catch(function(err) {
      res.status(500);
      res.send({error: err});
    });
});

app.get('/api/v1/coverage/:service/:owner/:repo', (req, res) => {
  const { service, owner, repo } = req.params;

  Coverage.get(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/${repo}`))
    .then((coverages) => {
      res.send(coverages);
    }).catch(function(err) {
      res.status(500);
      res.send({error: err});
    });
});

app.get('/badge/:service/:owner/:repo.svg', (req, res) => {
  const { service, owner, repo } = req.params;

  Coverage.get(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/${repo}`))
    .then((coverages) => {
      const coverage = coverages[0];
      const { history } = coverage;
      const lastRun = history[history.length - 1];
      const { lines } = lastRun.source_files[0];
      const percentage = parseInt((lines.hit / lines.found) * 100);
      Badge({text: ['coverage', `${percentage}%`] }, function(err, badge) {
          if(err) { throw new Error(err); }
          res.set('Content-Type', 'image/svg+xml; charset=utf-8');
          res.send(badge);
      });
    }).catch(function() {
        Badge({ color: { right: "#b63b3b" }, text: ['coverage', 'not found'] }, function(err, badge) {
            if(err) { throw new Error(err); }
            res.set('Content-Type', 'image/svg+xml; charset=utf-8');
            res.send(badge);
        });
    });
});

app.get('/build.js', (req, res) => {
  res.set('Content-Type', 'text/js; charset=utf-8');
  res.send(js);
});


app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.listen(port, function () {
  console.log(`node-coverage-server is listening on http://localhost:${port}`); // eslint-disable-line
});
