const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useMongoClient: true }, function(error) {
  if(error) {
    console.error(error.message); // eslint-disable-line
    process.exit(1);
  }
});

const express = require('express');
const Badge = require('badgeit');
const parse = require('git-url-parse');
const path = require('path');
const serveStatic = require('serve-static');
const compression = require('compression');
const bodyParser = require('body-parser');
const zlib = require('zlib');

zlib.level = zlib.Z_BEST_COMPRESSION;

const Coverage = require('./lib/coverage');

const port = process.env.PORT || 8080;
const asyncMiddleware = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(serveStatic(path.resolve(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

app.post('/api/upload', asyncMiddleware(async (req, res) => {
  let { git, run_at, source_files, service_job_id, service_pull_request, service_name } = req.body;

  // Make sure the remote url is set correctly
  git.remotes.url = parse(parse(git.remotes.url).toString("ssh")).toString("https");

  try {
    const results = await Coverage.save({
        source_files,
        git,
        run_at,
        service_job_id,
        service_pull_request,
        service_name
    });
    res.send({ results });
  } catch(error) {
    res.status(500);
    res.send({ error });
  }
}));

app.get('/api/repos', asyncMiddleware(async (req, res) => {
  try {
    const repos = await Coverage.repos();
    res.send(repos);
  } catch(error) {
    res.status(500);
    res.send({ error });
  }
}));

app.get('/api/feed/:page?', asyncMiddleware(async (req, res) => {
  const { page } = req.params;

  try {
    const feed = await Coverage.feed(page);
    res.send(feed);
  } catch(error) {
    res.status(500);
    res.send({ error });
  }
}));

app.get('/api/repos/:service/:owner/', asyncMiddleware(async (req, res) => {
  const { service, owner } = req.params;

  try {
    const coverages = await Coverage.repos(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/`));
    res.send(coverages);
  } catch(error) {
    res.status(500);
    res.send({ error });
  }
}));

app.get('/api/coverage/:service/:owner/:repo/', asyncMiddleware(async (req, res) => {
  const { limit } = req.query;
  const { service, owner, repo } = req.params;

  try {
    const coverages = await Coverage.get(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/${repo}`), limit);
    res.send(coverages);
  } catch(error) {
    res.status(500);
    res.send({ error });
  }
}));

app.get('/badge/:service/:owner/:repo.svg', asyncMiddleware(async (req, res) => {
  const { service, owner, repo } = req.params;

  try {
    const coverages = await Coverage.get(new RegExp(`${service.replace(/%2E/g, '.')}.*/${owner}/${repo}`), 1);
    const coverage = coverages[0];
    const { history } = coverage;
    const { source_files } = history[0];
    let found = 0;
    let hit = 0;
    source_files.forEach((file) => {
      const { lines={hit: 0, found: 0}, branches={hit: 0, found: 0}, functions={hit: 0, found: 0} } = file;
      found += lines.found + branches.found + functions.found;
      hit += lines.hit + branches.hit + functions.hit;
    });
    const percentage = parseInt((hit / found) * 100);
    const color = percentage >= 85 ? '#3DB712' : percentage <= 85 && percentage >= 70 ? '#caa300' : '#cc5338';

    const badge = await Badge({ color: { right: color }, text: ['coverage', `${percentage}%`] });
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(badge);
  } catch(error) {
    const badge = await Badge({ color: { right: "#b63b3b" }, text: ['coverage', 'not found'] });
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(badge);
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, function () {
  console.log(`lcov-server is listening on http://localhost:${port}`); // eslint-disable-line
});
