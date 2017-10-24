const test = require('tape');
const path = require('path');

const { parse } = require('../../lib/golang');

test('golang', function(t) {
  t.plan(4);

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
    const data = 'mode: count\nvip/handler.go:44.31,47.2 2 0\nvip/handler.go:49.71,54.16 4 7';
    const expected = [{
      title: 'handler.go',
      file: 'vip/handler.go',
      lines: {
        found: 10,
        hit: 6,
        details: [{
          line: 44,
          hit: 0
        }, {
          line: 45,
          hit: 0
        }, {
          line: 46,
          hit: 0
        }, {
          line: 47,
          hit: 0
        }, {
          line: 49,
          hit: 7
        }, {
          line: 50,
          hit: 7
        }, {
          line: 51,
          hit: 7
        }, {
          line: 52,
          hit: 7
        }, {
          line: 53,
          hit: 7
        }, {
          line: 54,
          hit: 7
        }]
      }
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
    const file = path.join(__dirname, '..', 'fixtures', 'golang', 'golang.txt');
    const expected = require('../fixtures/golang/golang.json');

    try {
      t.deepEqual(await parse(file), expected, 'data is correctly formed');
      t.end();
    } catch(ex) {
      t.ok(typeof ex !== 'undefined', 'error is not undefined');
      t.fail('should not return error');
      t.end();
    }
  }));

});
