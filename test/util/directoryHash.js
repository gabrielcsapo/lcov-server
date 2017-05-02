const test = require('tape');
const path = require('path');
const shell = require('shelljs');

const directoryHash = require('../../util/directoryHash');

test('git', (t) => {
  t.plan(3);

  t.test('should has sample module', (t) => {
    const root = process.cwd();
    process.chdir(path.resolve(__dirname, '..', 'fixtures', 'sample-module'));

    shell.exec('rm -rf .git');

     directoryHash(path.resolve(__dirname, '..', 'fixtures', 'sample-module'), (err, hash) => {
        t.ok(!err);
        t.ok(typeof hash, 'object');
        t.equal(hash.hash, 'ab8b06553376cacabeea93465bad0cda');
        t.equal(typeof hash.hash, 'string');
        t.equal(typeof hash.files, 'object');
        t.equal(hash.files['.gitignore'], '4069e9592c825c4335291c0796560106');
        t.equal(hash.files['index.js'], 'f77dbd5174d761fd143685cabbab59a5');
        t.equal(hash.files['package.json'], 'd3899d323ffe1e3ea8304ca8ced344b7');
        t.equal(typeof hash.files['test'], 'object');

        process.chdir(root);
        t.end();
     });
  });

  t.test('should be able to hash multiple paths', (t) => {
     directoryHash([path.resolve(__dirname, '../fixtures/sample-module/'), path.resolve(__dirname, '../fixtures/sample-module/test')], (result) => {
        t.equal(typeof result, 'object');
        t.equal(typeof result[path.resolve(__dirname, '../fixtures/sample-module/')], 'object');
        t.ok(!result[path.resolve(__dirname, '../fixtures/sample-module/')]['error']);
        t.ok(typeof result[path.resolve(__dirname, '../fixtures/sample-module/')]['result'], 'object');
        t.deepEqual(Object.keys(result[path.resolve(__dirname, '../fixtures/sample-module/')]), [ 'error', 'result' ]);

        t.equal(typeof result[path.resolve(__dirname, '../fixtures/sample-module/test')], 'object');
        t.ok(!result[path.resolve(__dirname, '../fixtures/sample-module/test')]['error']);
        t.ok(typeof result[path.resolve(__dirname, '../fixtures/sample-module/test')]['result'], 'object');
        t.deepEqual(Object.keys(result[path.resolve(__dirname, '../fixtures/sample-module/test')]), [ 'error', 'result' ]);
        t.end();
     });
  });

  t.test('should throw error path doesn\'t exist', (t) => {
      directoryHash('../thisdirectorydoesnotexist', (err, hash) => {
         t.ok(!hash);
         t.equal(err.toString(), "Error: ENOENT: no such file or directory, scandir '../thisdirectorydoesnotexist'");
         t.end();
      });
  });

});
