const test = require('tape');
const path = require('path');

const { parse } = require('../../lib/cobertura');

test('cobertura', function(t) {
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
    const data = `<?xml version="1.0"?>
    <!DOCTYPE coverage SYSTEM "http://cobertura.sourceforge.net/xml/coverage-04.dtd">
    <coverage>
      <sources>
        <source>ios</source>
      </sources>
      <packages>
        <package name="Headers">
          <classes>
            <class filename="NSException.h" name="NSException.h">
              <methods />
              <lines>
                <line branch="false" hits="0" number="102" />
                <line branch="false" hits="0" number="103" />
              </lines>
            </class>
          </classes>
        </package>
        <package name="Headers2">
          <classes>
            <class filename="NSException.h" name="NSException.h" />
          </classes>
        </package>
      </packages>
    </coverage>`;

    const expected = [{
      title: 'NSException.h',
      file: 'NSException.h',
      functions: {
        found: 0,
        hit: 0,
        details: []
      },
      lines: {
        found: 2,
        hit: 0,
        details: [{
          line: 102,
          hit: 0
        }, {
          line: 103,
          hit: 0
        }]
      }
    }, {
      title: 'NSException.h',
      file: 'NSException.h',
      functions: {
        found: 0,
        hit: 0,
        details: []
      },
      lines: {
        found: 0,
        hit: 0,
        details: []
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
    const file = path.join(__dirname, '..', 'fixtures', 'cobertura', 'cobertura.xml');
    const expected = require(path.join(__dirname, '..', 'fixtures', 'cobertura', 'cobertura.json'));

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
