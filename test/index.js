const test = require('tape');
const path = require('path');
const http = require('http');
const shell = require('shelljs');

test('node-coverage-cli', (t) => {
    t.plan(1);

    t.test('successfully send coverage to server', (t) => {
        const port = 8080;
        const wdir = process.cwd();
        const server = http.createServer((request, response) => {
            let data = '';

            request.on('data', function(d) {
                data += d;
            });

            request.on('end', function() {
                const output = JSON.parse(data);
                t.deepEqual(Object.keys(output), ['service_job_id', 'service_pull_request', 'service_name', 'source_files', 'git', 'run_at']);
                t.equal(Array.isArray(output['source_files']), true);
                t.equal(typeof output['git'], 'object');
                t.deepEqual(Object.keys(output['git']), ['commit', 'author_name', 'author_email', 'author_date', 'committer_name', 'committer_email', 'committer_date', 'message', 'branch', 'remotes']);

                shell.exec('rm -rf .git');

                response.end();
                server.close();
                process.chdir(wdir);
                t.end();
            });
        }).listen(port, (err) => {
            if (err) {
                t.fail(err);
            }
            console.log(`node-coverage-server is listening on http://localhost:${port}`); // eslint-disable-line

            process.chdir(path.resolve(__dirname, 'fixtures', 'sample-module'));

            shell.exec('rm -rf .git');
            shell.exec('git init');
            shell.exec('git add -A');
            shell.exec('git commit -m "Initial Commit"');
            shell.exec('git remote add origin http://github.com/gabrielcsapo/sample-module');

            shell.exec(`./node_modules/.bin/tap test/**.js --coverage --coverage-report=text-lcov | ../../../bin/lcov-server-cli.js --url http://localhost:${port}`, {
                async: true
            });
        });
    });

    t.end();
});
