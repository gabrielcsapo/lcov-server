const test = require('tape').test;
const path = require('path');
const shell = require('shelljs');

const { parse } = require('../../lib/git');

test('git', (t) => {
  t.plan(3);

  t.test('should fail because directory is not a git directory', (async (t) => {
    process.chdir(__dirname);
    try {
      t.ok(await parse() !== undefined);
      t.fail('should not return data');
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.ok(ex === 'directory does not contain git');
      t.end();
    }
  }));

  t.test('should return the correct data', (async (t) => {
    var keys = [ 'author_date', 'author_email', 'author_name', 'branch', 'commit',
      'committer_date', 'committer_email', 'committer_name', 'message', 'remotes' ];
    process.chdir(path.resolve(__dirname, '..', '..'));
    try {
      t.deepEqual(Object.keys(await parse()).sort(), keys);
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.fail('should not return an error');
      t.end();
    }
  }));

  t.test('should fail when no remote is present', (async (t) => {
    const root = process.cwd();
    process.chdir(path.resolve(__dirname, '..', 'fixtures', 'sample-module'));

    shell.exec('git init');
    shell.exec('git add -A');
    shell.exec('git commit -m "testtest"');
    try {
      t.notOk(await parse());
      t.fail('should fail, but doesn\'t');
      process.chdir(root);
    } catch(ex) {
      t.equal(ex, 'no remote found');
      t.end();
      process.chdir(root);
    }
  }));

});
