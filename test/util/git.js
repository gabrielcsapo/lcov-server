const test = require('tape').test;
const path = require('path');
const git = require('../../util/git');

test('git', (t) => {
  t.plan(2);

  t.test('should fail because directory is not a git directory', (t) => {
    process.chdir(__dirname);
    git.parse()
      .then((data) => {
        t.ok(data !== undefined);
        t.fail('should not return data');
        t.end();
      })
      .catch((err) => {
        t.ok(typeof err !== 'undefined', 'error is not undefined');
        t.ok(err === 'directory does not contain git');
        t.end();
      });
  });

  t.test('should return the correct data', (t) => {
    var keys = [ 'author_date', 'author_email', 'author_name', 'branch', 'commit',
      'committer_date', 'committer_email', 'committer_name', 'message', 'remotes' ];
    process.chdir(path.resolve(__dirname, '..', '..'));
    git.parse()
      .then((data) => {
        t.deepEqual(Object.keys(data).sort(), keys);
        t.end();
      })
      .catch((err) => {
        t.ok(typeof err !== 'undefined', 'error is not undefined');
        t.fail('should not return an error');
        t.end();
      });
  });

  t.end();
});
