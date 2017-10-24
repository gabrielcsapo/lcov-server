/**
 * @module lib/jacoco
 */

const fs = require('fs');
const { parseString } = require('xml2js');

function getCounter(source, type) {
  return source.counter.filter(function(counter) {
    return counter.$.type === type;
  })[0];
}

function walkFile(xml, cb) {
  parseString(xml, function(err, parseResult) {
    if (err) {
      return cb('Failed to parse coverage');
    }

    var packages = parseResult.report.package;
    var output = [];

    packages.forEach(function(pack) {
        var cov = pack.sourcefile.map(function(s) {
        var fullPath = pack.$.name + '/' + s.$.name;
        var className = fullPath.substring(0, fullPath.lastIndexOf('.'));

        var c = pack.class.filter(function(cl) {
          return cl.$.name === className;
        })[0];

        var methods = getCounter(s, "METHOD");
        var lines = getCounter(s, "LINE");
        var branches = getCounter(s, "BRANCH");
        if (!branches) {
          branches = {
            $: {
              covered: 0,
              missed: 0
            }
          };
        }
        var classCov = {
          title: s.$.name,
          file: fullPath,
          functions: {
            found: Number(methods.$.covered) + Number(methods.$.missed),
            hit: Number(methods.$.covered),
            details: !c.method ? [] : c.method.map(function(m) {
              var hit = m.counter.some(function(counter) {
                return counter.$.type === "METHOD" && counter.$.covered === "1";
              });
              return {
                name: m.$.name,
                line: Number(m.$.line),
                hit: hit ? 1 : 0
              };
            })
          },
          lines: {
            found: Number(lines.$.covered) + Number(lines.$.missed),
            hit: Number(lines.$.covered),
            details: !s.line ? [] : s.line.map(function(l) {
              return {
                line: Number(l.$.nr),
                hit: Number(l.$.ci)
              };
            })
          },
          branches: {
            found: Number(branches.$.covered) + Number(branches.$.missed),
            hit: Number(branches.$.covered),
            details: !s.line ? [] : [].concat.apply([],
              s.line.filter(function(l) {
                return Number(l.$.mb) > 0 || Number(l.$.cb) > 0;
              })
              .map(function(l) {
                var branches = [];
                var count = Number(l.$.mb) + Number(l.$.cb);

                for (var i = 0; i < count; ++i) {
                  branches = branches.concat({
                    line: Number(l.$.nr),
                    block: 0,
                    branch: Number(i),
                    taken: i < Number(l.$.cb) ? 1 : 0
                  });
                }

                return branches;
              })
            )
          }
        };

        return classCov;
      });

      output = output.concat(cov);
    });

    cb(null, output);
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
