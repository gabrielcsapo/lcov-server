const test = require('tape');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const cli = require('../../lib/cli');

test('cli', function(t) {
  t.plan(5);

  t.test('should be fail to parse and upload lcov because no file exists', (async (t) => {
    var lcov = fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', 'lcov', 'lcov.info')).toString('utf8');

    try {
      let response = await cli({ input: lcov, parser: 'lcov', url: 'http://localhost:8080' });
      t.equal(response, '');
      t.fail('should not pass');
    } catch(ex) {
      t.equal(ex, 'can not find file at anim-base/anim-base-coverage.js');
      t.end();
    }
  }));

  t.test('should be able to parse and upload lcov', (t) => {
      const port = 8080;
      const app = express();
      app.use(bodyParser.json());

      app.post('/api/upload', (req, res) => {
        t.deepEqual(Object.keys(req.body).sort(), [
          'git',
          'run_at',
          'service_job_id',
          'service_name',
          'service_pull_request',
          'source_files'
        ]);
        t.equal(Array.isArray(req.body['source_files']), true);
        t.equal(typeof req.body['git'], 'object');
        t.deepEqual(Object.keys(req.body['git']).sort(), [
          'author_date',
          'author_email',
          'author_name',
          'branch',
          'commit',
          'committer_date',
          'committer_email',
          'committer_name',
          'message',
          'remotes'
        ]);

        res.status(200).end(JSON.stringify({ success: 'sent successfully' }));
      });

      const server = app.listen(port, (async (err) => {
        if (err) {
          return t.fail(err);
        }
        var lcov = fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', 'lcov', 'lcov.info')).toString('utf8');

        try {
          let response = await cli({ input: lcov, parser: 'lcov', url: 'http://localhost:8080', basePath: path.resolve(__dirname, '..', 'fixtures', 'lcov') });
          server.close();
          t.equal(response.success, 'sent successfully');
          t.end();
        } catch(ex) {
          server.close();
          t.fail(ex);
        }
      }));
  });

  t.test('should be able to parse and upload jacoco', (t) => {
      const port = 8080;
      const app = express();
      app.use(bodyParser.json());

      app.post('/api/upload', (req, res) => {
        t.deepEqual(Object.keys(req.body).sort(), [
          'git',
          'run_at',
          'service_job_id',
          'service_name',
          'service_pull_request',
          'source_files'
        ]);
        t.equal(Array.isArray(req.body['source_files']), true);
        t.equal(typeof req.body['git'], 'object');
        t.deepEqual(Object.keys(req.body['git']).sort(), [
          'author_date',
          'author_email',
          'author_name',
          'branch',
          'commit',
          'committer_date',
          'committer_email',
          'committer_name',
          'message',
          'remotes'
        ]);

        res.status(200).end(JSON.stringify({ success: 'sent successfully' }));
      });

      const server = app.listen(port, (async (err) => {
        if (err) {
          return t.fail(err);
        }
        var lcov = fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', 'jacoco', 'jacoco.xml')).toString('utf8');

        try {
          let response = await cli({ input: lcov, parser: 'jacoco', url: 'http://localhost:8080', basePath: path.resolve(__dirname, '..', 'fixtures', 'jacoco', 'src', 'main') });
          server.close();
          t.equal(response.success, 'sent successfully');
          t.end();
        } catch(ex) {
          server.close();
          t.fail(ex);
        }
      }));
  });

  t.test('should be able to parse and upload golang', (t) => {
      const port = 8080;
      const app = express();
      app.use(bodyParser.json());

      app.post('/api/upload', (req, res) => {
        t.deepEqual(Object.keys(req.body).sort(), [
          'git',
          'run_at',
          'service_job_id',
          'service_name',
          'service_pull_request',
          'source_files'
        ]);
        t.equal(Array.isArray(req.body['source_files']), true);
        t.equal(typeof req.body['git'], 'object');
        t.deepEqual(Object.keys(req.body['git']).sort(), [
          'author_date',
          'author_email',
          'author_name',
          'branch',
          'commit',
          'committer_date',
          'committer_email',
          'committer_name',
          'message',
          'remotes'
        ]);

        res.status(200).end(JSON.stringify({ success: 'sent successfully' }));
      });

      const server = app.listen(port, (async (err) => {
        if (err) {
          return t.fail(err);
        }
        var lcov = fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', 'golang', 'golang.txt')).toString('utf8');

        try {
          let response = await cli({ input: lcov, parser: 'golang', url: 'http://localhost:8080', basePath: path.resolve(__dirname, '..', 'fixtures', 'golang', 'src') });
          server.close();
          t.equal(response.success, 'sent successfully');
          t.end();
        } catch(ex) {
          server.close();
          t.fail(ex);
        }
      }));
  });

  t.test('should be able to parse and upload cobertura', (t) => {
      const port = 8080;
      const app = express();
      app.use(bodyParser.json());

      app.post('/api/upload', (req, res) => {
        t.deepEqual(Object.keys(req.body).sort(), [
          'git',
          'run_at',
          'service_job_id',
          'service_name',
          'service_pull_request',
          'source_files'
        ]);
        t.equal(Array.isArray(req.body['source_files']), true);
        t.equal(typeof req.body['git'], 'object');
        t.deepEqual(Object.keys(req.body['git']).sort(), [
          'author_date',
          'author_email',
          'author_name',
          'branch',
          'commit',
          'committer_date',
          'committer_email',
          'committer_name',
          'message',
          'remotes'
        ]);

        res.status(200).end(JSON.stringify({ success: 'sent successfully' }));
      });

      const server = app.listen(port, (async (err) => {
        if (err) {
          return t.fail(err);
        }
        var lcov = fs.readFileSync(path.resolve(__dirname, '..', 'fixtures', 'cobertura', 'cobertura.xml')).toString('utf8');

        try {
          let response = await cli({ input: lcov, parser: 'cobertura', url: 'http://localhost:8080', basePath: path.resolve(__dirname, '..', 'fixtures', 'cobertura', 'src') });
          server.close();
          t.equal(response.success, 'sent successfully');
          t.end();
        } catch(ex) {
          server.close();
          t.fail(ex);
        }
      }));
  });

});
