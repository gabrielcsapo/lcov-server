const test = require('tape');
const path = require('path');
const fs = require('fs');

const { parse, clean } = require('../../lib/lcov');

test('lcov', function(t) {
  t.plan(5);

  t.test('parse should be a function', function(t) {
    t.ok(typeof parse === 'function');
    t.end();
  });

  t.test('should return error on bad file parsing', (async function(t) {
    try {
      t.ok(await parse('foobar') !== undefined);
      t.fail('should not return error');
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.end();
    }
  }));

  t.test('should be able to parse string', (async function(t) {
    const data = 'TN:TestName\nSF:foobar.js\nend_of_record\n';
    const expected = [{
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
    try {
      t.deepEqual(await parse(data), expected, 'data is correctly formed');
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.fail('should not return error');
      t.end();
    }
  }));

  t.test('should be able to parse file', (async function(t) {
    const file = path.join(__dirname, '..', 'fixtures', 'lcov', 'lcov.info');
    const expected = require('../fixtures/lcov/lcov.json');
    try {
      t.deepEqual(await parse(file), expected, 'data is correctly formed');
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.fail('should not return error');
      t.end();
    }
  }));

  t.test('should be able to clean a malformed input', (t) => {
    const expected = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'lcov', 'cleaned-lcov.txt')).toString('utf8');
    const file = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'lcov', 'uncleaned-lcov.txt')).toString('utf8');

    t.equal(clean(file), expected);
    t.end();
  });

});
