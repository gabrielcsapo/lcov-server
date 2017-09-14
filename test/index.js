const test = require('tape');
const path = require('path');
const express = require('express');
const shell = require('shelljs');

const { parseBody } = require('../lib/util');

test('lcov-server-cli', (t) => {
  t.plan(1);

  t.test('successfully send coverage to server', (t) => {
    const port = 8080;
    const wdir = process.cwd();
    const app = express();

    app.post('/api/v1/upload', parseBody, (req, res) => {
      t.deepEqual(Object.keys(req.body), ['service_job_id', 'service_pull_request', 'service_name', 'source_files', 'git', 'run_at']);
      t.equal(Array.isArray(req.body['source_files']), true);
      t.equal(typeof req.body['git'], 'object');
      t.deepEqual(Object.keys(req.body['git']), ['commit', 'author_name', 'author_email', 'author_date', 'committer_name', 'committer_email', 'committer_date', 'message', 'branch', 'remotes']);

      res.status(200).end();
    });


    const server = app.listen(port, (err) => {
      if (err) {
        t.fail(err);
        return;
      }
      console.log(`node-coverage-server is listening on http://localhost:${port}`); // eslint-disable-line

      process.chdir(path.resolve(__dirname, 'fixtures', 'sample-module'));

      shell.exec('npm install');
      shell.exec('rm -rf .git');
      shell.exec('git init');
      shell.exec('git add -A');
      shell.exec('git commit -m "Initial Commit"');
      shell.exec('git remote add origin http://github.com/gabrielcsapo/sample-module');

      shell.exec(`./node_modules/.bin/tap test/**.js --coverage --coverage-report=text-lcov | ../../../bin/lcov-server-cli.js --url http://localhost:${port}`, () => { 
        shell.exec('rm -rf .git');
        server.close();
        process.chdir(wdir);

        t.end();
      });
    });
  });

});
