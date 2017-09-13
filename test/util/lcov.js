const path = require('path');
const lcov = require('../../lib/lcov');
const test = require('tape');

test('lcov', function(t) {
  t.plan(4);

  t.test('parse should be a function', function(t) {
    t.ok(typeof lcov.parse === 'function');
    t.end();
  });

  t.test('should return error on bad file parsing', function(t) {
    lcov.parse('foobar')
      .then(function(data) {
        t.ok(data !== undefined);
        t.fail('should not return error');
        t.end();
      }).catch(function(err) {
        t.ok(typeof err !== 'undefined', 'error is not undefined');
        t.end();
      });
  });

  t.test('should be able to parse string', function(t) {
    var data = 'TN:TestName\nSF:foobar.js\nend_of_record\n';
    var expected = [{
        lines: {
            found: 0,
            hit: 0,
            details: []
        },
        functions: {
            hit: 0,
            found: 0,
            details: []
        },
        branches: {
            hit: 0,
            found: 0,
            details: []
        },
        title: 'TestName',
        file: 'foobar.js'
    }];
    lcov.parse(data)
      .then(function(data) {
        t.deepEqual(data, expected, 'data is correctly formed');
        t.end();
      }).catch(function(err) {
        t.ok(typeof err !== 'undefined', 'error is not undefined');
        t.fail('should not return error');
        t.end();
      });
  });

  t.test('should be able to parse file', function(t) {
    const file = path.join(__dirname, '..', 'fixtures', 'lcov.info');
    const expected = require('../fixtures/lcov.json');
    lcov.parse(file)
      .then(function(data) {
        t.deepEqual(data, expected, 'data is correctly formed');
        t.end();
      }).catch(function(err) {
        t.ok(typeof err !== 'undefined', 'error is not undefined');
        t.fail('should not return error');
        t.end();
      });
  });

});
