const test = require('tape');
const path = require('path');
const express = require('express');
const shell = require('shelljs');

const bodyParser = require('body-parser');

test('lcov-server-cli', (t) => {
  t.plan(1);

  t.test('successfully send lcov coverage to server', (t) => {
    const port = 8080;
    const wdir = process.cwd();
    const app = express();
    app.use(bodyParser.json());

    app.post('/api/upload', (req, res) => {
      t.deepEqual(Object.keys(req.body).sort(), [
        'git',
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


    const server = app.listen(port, (err) => {
      if (err) {
        t.fail(err);
        return;
      }
      process.chdir(path.resolve(__dirname, 'fixtures', 'sample-module'));

      shell.exec('npm install');
      shell.exec('rm -rf .git');
      shell.exec('git init');
      shell.exec('git add -A');
      shell.exec('git commit -m "Initial Commit"');
      shell.exec('git remote add origin http://github.com/gabrielcsapo/sample-module');

      shell.exec(`./node_modules/.bin/tap test/index.js --coverage --coverage-report=text-lcov | ../../../bin/lcov-server.js --upload http://localhost:${port}`, { silent: true }, (code, stdout, stderr) => {
        t.equal(code, 0);
        t.equal(stdout, '\n coverage sent successfully 💚 \n\n');
        t.equal(stderr, '');

        shell.exec('rm -rf .git');
        server.close();
        process.chdir(wdir);

        t.end();
      });
    });
  });

});
