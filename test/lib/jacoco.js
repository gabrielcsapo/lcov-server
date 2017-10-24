const test = require('tape');
const path = require('path');

const { parse } = require('../../lib/jacoco.js');

test('jacoco', function(t) {
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
    const data = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <!DOCTYPE report PUBLIC "-//JACOCO//DTD Report 1.0//EN" "report.dtd">
      <report name="debug">
        <sessioninfo id="unknownhost-3ec3adb3" start="1435852061594" dump="1435852061672"/>
        <package name="com/wmbest/myapplicationtest">
          <class name="com/wmbest/myapplicationtest/MainActivity">
            <method name="&lt;init&gt;" desc="()V" line="8">
              <counter type="INSTRUCTION" missed="3" covered="0"/>
              <counter type="LINE" missed="1" covered="0"/>
              <counter type="COMPLEXITY" missed="1" covered="0"/>
              <counter type="METHOD" missed="1" covered="0"/>
            </method>
            <method name="checkTheseLines" desc="()Ljava/lang/Boolean;" line="11">
              <counter type="INSTRUCTION" missed="1" covered="10"/>
              <counter type="BRANCH" missed="1" covered="1"/>
              <counter type="LINE" missed="0" covered="3"/>
              <counter type="COMPLEXITY" missed="1" covered="1"/>
              <counter type="METHOD" missed="0" covered="1"/>
            </method>
            <method name="onCreate" desc="(Landroid/os/Bundle;)V" line="18">
              <counter type="INSTRUCTION" missed="7" covered="0"/>
              <counter type="LINE" missed="3" covered="0"/>
              <counter type="COMPLEXITY" missed="1" covered="0"/>
              <counter type="METHOD" missed="1" covered="0"/>
            </method>
            <method name="onCreateOptionsMenu" desc="(Landroid/view/Menu;)Z" line="25">
              <counter type="INSTRUCTION" missed="7" covered="0"/>
              <counter type="LINE" missed="2" covered="0"/>
              <counter type="COMPLEXITY" missed="1" covered="0"/>
              <counter type="METHOD" missed="1" covered="0"/>
            </method>
            <method name="onOptionsItemSelected" desc="(Landroid/view/MenuItem;)Z" line="34">
              <counter type="INSTRUCTION" missed="12" covered="0"/>
              <counter type="BRANCH" missed="2" covered="0"/>
              <counter type="LINE" missed="4" covered="0"/>
              <counter type="COMPLEXITY" missed="2" covered="0"/>
              <counter type="METHOD" missed="1" covered="0"/>
            </method>
            <counter type="INSTRUCTION" missed="30" covered="10"/>
            <counter type="BRANCH" missed="3" covered="1"/>
            <counter type="LINE" missed="10" covered="3"/>
            <counter type="COMPLEXITY" missed="6" covered="1"/>
            <counter type="METHOD" missed="4" covered="1"/>
            <counter type="CLASS" missed="0" covered="1"/>
          </class>
          <sourcefile name="MainActivity.java">
            <line nr="8" mi="3" ci="0" mb="0" cb="0"/>
            <line nr="11" mi="0" ci="2" mb="0" cb="0"/>
            <line nr="12" mi="0" ci="1" mb="0" cb="0"/>
            <line nr="13" mi="1" ci="7" mb="1" cb="1"/>
            <line nr="18" mi="3" ci="0" mb="0" cb="0"/>
            <line nr="19" mi="3" ci="0" mb="0" cb="0"/>
            <line nr="20" mi="1" ci="0" mb="0" cb="0"/>
            <line nr="25" mi="5" ci="0" mb="0" cb="0"/>
            <line nr="26" mi="2" ci="0" mb="0" cb="0"/>
            <line nr="34" mi="3" ci="0" mb="0" cb="0"/>
            <line nr="37" mi="3" ci="0" mb="2" cb="0"/>
            <line nr="38" mi="2" ci="0" mb="0" cb="0"/>
            <line nr="41" mi="4" ci="0" mb="0" cb="0"/>
            <counter type="INSTRUCTION" missed="30" covered="10"/>
            <counter type="BRANCH" missed="3" covered="1"/>
            <counter type="LINE" missed="10" covered="3"/>
            <counter type="COMPLEXITY" missed="6" covered="1"/>
            <counter type="METHOD" missed="4" covered="1"/>
            <counter type="CLASS" missed="0" covered="1"/>
          </sourcefile>
          <counter type="INSTRUCTION" missed="30" covered="10"/>
          <counter type="BRANCH" missed="3" covered="1"/>
          <counter type="LINE" missed="10" covered="3"/>
          <counter type="COMPLEXITY" missed="6" covered="1"/>
          <counter type="METHOD" missed="4" covered="1"/>
          <counter type="CLASS" missed="0" covered="1"/>
        </package>
        <counter type="INSTRUCTION" missed="30" covered="10"/>
        <counter type="BRANCH" missed="3" covered="1"/>
        <counter type="LINE" missed="10" covered="3"/>
        <counter type="COMPLEXITY" missed="6" covered="1"/>
        <counter type="METHOD" missed="4" covered="1"/>
        <counter type="CLASS" missed="0" covered="1"/>
      </report>`;
    const expected = [{
      title: 'MainActivity.java',
      file: 'com/wmbest/myapplicationtest/MainActivity.java',
      functions: {
        found: 5,
        hit: 1,
        details: [{
          name: '<init>',
          line: 8,
          hit: 0
        }, {
          name: 'checkTheseLines',
          line: 11,
          hit: 1
        }, {
          name: 'onCreate',
          line: 18,
          hit: 0
        }, {
          name: 'onCreateOptionsMenu',
          line: 25,
          hit: 0
        }, {
          name: 'onOptionsItemSelected',
          line: 34,
          hit: 0
        }]
      },
      lines: {
        found: 13,
        hit: 3,
        details: [{
          line: 8,
          hit: 0
        }, {
          line: 11,
          hit: 2
        }, {
          line: 12,
          hit: 1
        }, {
          line: 13,
          hit: 7
        }, {
          line: 18,
          hit: 0
        }, {
          line: 19,
          hit: 0
        }, {
          line: 20,
          hit: 0
        }, {
          line: 25,
          hit: 0
        }, {
          line: 26,
          hit: 0
        }, {
          line: 34,
          hit: 0
        }, {
          line: 37,
          hit: 0
        }, {
          line: 38,
          hit: 0
        }, {
          line: 41,
          hit: 0
        }]
      },
      branches: {
        found: 4,
        hit: 1,
        details: [{
          line: 13,
          block: 0,
          branch: 0,
          taken: 1
        }, {
          line: 13,
          block: 0,
          branch: 1,
          taken: 0
        }, {
          line: 37,
          block: 0,
          branch: 0,
          taken: 0
        }, {
          line: 37,
          block: 0,
          branch: 1,
          taken: 0
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
    const file = path.join(__dirname, '..', 'fixtures', 'jacoco', 'jacoco.xml');
    const expected = require('../fixtures/jacoco/jacoco.json');

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
