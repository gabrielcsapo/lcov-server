const test = require('tape');
const Dictionary = require('../');

test('sample-module', (t) => {
  t.plan(2);

  const dictionary = new Dictionary();

  t.test('set', (t) => {
    dictionary.set('name', 'Gabriel J. Csapo');
    t.equal(dictionary.dictionary['name'], 'Gabriel J. Csapo');
    t.end();
  });

  t.test('get', (t) => {
    dictionary.set('name', 'Gabriel J. Csapo');
    t.equal(dictionary.get('name'), 'Gabriel J. Csapo');
    t.end();
  });

  t.end();
});
