var crypto = require('crypto');
var fs = require('fs');

function _summarize(method, hashes, callback) {
  var keys = Object.keys(hashes);
  keys.sort();

  var obj = {};
  obj.files = hashes;
  var hash = crypto.createHash(method);
  for (var i = 0; i < keys.length; i++) {
    if (typeof(hashes[keys[i]]) === 'string') {
      hash.update(hashes[keys[i]]);
    } else if (typeof(hashes[keys[i]]) === 'object') {
      hash.update(hashes[keys[i]].hash);
    } else {
      callback('Unknown type found in hash: ' + typeof(hashes[keys[i]]), undefined);
    }
  }

  obj.hash = hash.digest('hex');
  return obj;
}

module.exports = function hashDirectory(root, method, callback) {
  if (method) {
    if (typeof(method) === 'string') {
      // NO-OP
    } else if (typeof(method) === 'function') {
      callback = method;
      method = 'md5';
    } else {
      return callback('hash must be a string', undefined);
    }
  } else {
    return callback('callback is required (function)', undefined);
  }
  if (!callback) {
    return callback('callback is required (function)', undefined);
  }
  if (!root) {
    return callback('root is required (string, array<string>)', undefined);
  } else {
    if(Array.isArray(root) == 'false') {
      return callback('root is required (string, array<string>)', undefined);
    }
    if(Array.isArray(root)) {
      var results = {};
      root.forEach((r) => {
         hashDirectory(r, method, (error, result) => {
           results[r] = { error, result };
           if(Object.keys(results).length == root.length) {
             callback(results);
           }
         });
      });
      return;
    }
  }

  const hashes = {};

  fs.readdir(root, (err, files) => {
    if (err) return callback(err);

    if (files.length === 0) {
      return callback(undefined, {hash: '', files: {}});
    }

    var hashed = 0;
    files.forEach((f) => {
      var path = root + '/' + f;
      fs.stat(path, function(err, stats) {
        if (err) return callback(err);

        if (stats.isDirectory()) {
          return hashDirectory(path, method, function(err, hash) {
            if (err) return hash;

            hashes[f] = hash;
            if (++hashed >= files.length) {
              return callback(undefined, _summarize(method, hashes, callback));
            }
          });
        } else if (stats.isFile()) {
          fs.readFile(path, 'utf8', function(err, data) {
            if (err) return callback(err);

            var hash = crypto.createHash(method);
            hash.update(data);
            hashes[f] = hash.digest('hex');

            if (++hashed >= files.length) {
              return callback(undefined, _summarize(method, hashes, callback));
            }
          });
        } else {
          if (++hashed > files.length) {
            return callback(undefined, _summarize(method, hashes, callback));
          }
        }
      });
    });
  });
};
