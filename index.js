const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });

const express = require('express');
const Badge = require('openbadge');
const parse = require('git-url-parse');
const path = require('path');
const serveStatic = require('serve-static');
const compression = require('compression');
const bodyParser = require('body-parser');
const zlib = require('zlib');

zlib.level = zlib.Z_BEST_COMPRESSION;

const Coverage = require('./lib/coverage');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(serveStatic(path.resolve(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

app.post('/api/upload', (req, res) => {
  let {
    git,
    run_at,
    source_files,
    service_job_id,
    service_pull_request,
    service_name
  } = req.body;

  // Make sure the remote url is set correctly
  git.remotes.url = parse(parse(git.remotes.url).toString("ssh")).toString("https");

  Coverage.save({
      source_files,
      git,
      run_at,
      service_job_id,
      service_pull_request,
      service_name
  }).then((result) => {
    res.send({ result });
  }).catch((err) => {
    res.status(500);
    res.send({ error: err });
  });
});

app.get('/api/repos', (req, res) => {
  Coverage.repos()
    .then((repos) => {
      res.send(repos);
    }).catch(function(err) {
      res.status(500);
      res.send({error: err});
    });
});

app.get('/api/repos/:service/:owner', (req, res) => {
  const { service, owner } = req.params;

  Coverage.repos(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/`))
    .then((coverages) => {
      res.send(coverages);
    }).catch(function(err) {
      res.status(500);
      res.send({error: err});
    });
});

app.get('/api/coverage/:service/:owner/:repo', (req, res) => {
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
      const color = percentage >= 90 ? '#3DB712' : percentage <= 89 && percentage >= 80 ? '#caa300' : '#cc5338';

      Badge({ color: { right: color }, text: ['coverage', `${percentage}%`] }, function(err, badge) {
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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, function () {
  console.log(`lcov-server is listening on http://localhost:${port}`); // eslint-disable-line
});
