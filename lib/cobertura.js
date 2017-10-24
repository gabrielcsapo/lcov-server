/**
 * @module lib/cobertura
 */

var fs = require('fs');
var { parseString } = require('xml2js');

function walkFile(xml, cb) {
  parseString(xml, function(err, parseResult) {
    if (err) {
      return cb('Failed to parse coverage');
    }

    var classes = [];
    var packages = parseResult.coverage.packages;
    packages.forEach(function(packages) {
      packages.package.forEach(function(pack) {
        pack.classes.forEach(function(c) {
          classes = classes.concat(c.class);
        });
      });
    });

    var codeCov = classes.map(function(c) {
      var classCov = {
        title: c.$.name,
        file: c.$.filename,
        functions: {
          found: c.methods && c.methods[0].method ? c.methods[0].method.length : 0,
          hit: 0,
          details: !c.methods || !c.methods[0].method ? [] : c.methods[0].method.map(function(m) {
            return {
              name: m.$.name,
              line: Number(m.lines[0].line[0].$.number),
              hit: Number(m.lines[0].line[0].$.hits)
            };
          })
        },
        lines: {
          found: c.lines && c.lines[0].line ? c.lines[0].line.length : 0,
          hit: 0,
          details: !c.lines || !c.lines[0].line ? [] : c.lines[0].line.map(function(l) {
            return {
              line: Number(l.$.number),
              hit: Number(l.$.hits)
            };
          })
        }
      };

      classCov.functions.hit = classCov.functions.details.reduce(function(acc, val) {
        return acc + (val.hit > 0 ? 1 : 0);
      }, 0);

      classCov.lines.hit = classCov.lines.details.reduce(function(acc, val) {
        return acc + (val.hit > 0 ? 1 : 0);
      }, 0);

      return classCov;
    });

    cb(null, codeCov);
  });
}

/**
 * returns a javascript object that represents the coverage data
 * @method parse
 * @param  {String|Path} file - this can either be a string or a path to a file
 * @return {Coverage} - The coverage data structure
 *
 */
function parse(file) {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(file)) {
      fs.readFile(file, 'utf8', (err, str) => {
        if (err) {
          reject(err);
        }
        return walkFile(str, function(err, result) {
          if (err) return reject(err);
          resolve(result);
        });
      });
    } else {
      return walkFile(file, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}

module.exports = {
  walkFile,
  parse
};
