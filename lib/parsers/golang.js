/**
 * @module lib/parsers/golang
 */

var fs = require("fs");

function walkFile(text, cb) {
  if(text.indexOf('mode:') == -1) {
    return cb('Failed to parse string', null);
  }

  var files = [];
  var modes = text.split("mode:");

  modes.forEach(function(mode) {
    if (!mode.length) {
      return;
    }

    var lines = mode.replace("\r\n", "\n").split(/[\n\r]/g);
    lines = lines.slice(1); // the first line is just the mode type

    lines.forEach(function(line) {
      var parts = line.split(":");
      if (!parts.length) {
        return;
      }

      var path = parts[0];
      var values = parts[1];

      if (!path || !values) {
        return;
      }

      if (!files[files.length - 1] || files[files.length - 1].file !== path) {
        var name = path.split("/");
        name = name[name.length - 1];

        files.push({
          title: name,
          file: path,
          lines: {
            found: 0,
            hit: 0,
            details: []
          }
        });
      }

      var file = files[files.length - 1];

      var startLine = Number(values.split(",")[0].split(".")[0]);
      var endLine = Number(values.split(",")[1].split(".")[0]);
      var hit = Number(values.split(" ")[2]);

      file.lines.found += endLine - startLine + 1;
      for (var lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
        var existingLine = file.lines.details.filter(function(ex) {
          return ex.line === lineNumber;
        })[0];

        if (existingLine) {
          existingLine.hit += hit;
        } else {
          file.lines.details.push({
            line: lineNumber,
            hit: hit
          });
        }
      }
    });
  });


  files.forEach(function(file) {
    file.lines.hit = file.lines.details.reduce(function(acc, val) {
      return acc + (val.hit > 0 ? 1 : 0);
    }, 0);
  });

  cb(null, files);
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
