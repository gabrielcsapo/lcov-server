var test = require('tape').test;
var path = require('path');
var git = require('../../util/git');

test('git', function(t) {
  t.plan(2);

  t.test('should fail because directory is not a git directory', function(t) {
    process.chdir(__dirname);
    git(function(err, data) {
      t.ok(err === 'directory does not contain git');
      t.ok(typeof data === 'undefined');
      t.end();
    });
  });

  t.test('should return the correct data', function(t) {
    var keys = [ 'author_date', 'author_email', 'author_name', 'branch', 'commit',
      'committer_date', 'committer_email', 'committer_name', 'message', 'remotes' ];
    process.chdir(path.resolve(__dirname, '..', '..'));
    git(function(err, data) {
      t.ok(typeof err === 'undefined');
      t.deepEqual(Object.keys(data).sort(), keys);
      t.end();
    });
  });

  t.end();
});
