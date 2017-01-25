const MongoClient = require('mongodb').MongoClient;

/**
 * @class Coverage
 * @example
 *
 *{
 *   "source_files": [{
 *       "name": "util/lcov.js",
 *       "source": "var fs = require('fs'),\n    path = require('path');\n\nvar exists = fs.exists || path.exists;\n\nvar walkFile = function(str, cb) {\n    var data = [], item;\n\n    [ 'end_of_record' ].concat(str.split('\\n')).forEach(function(line) {\n        line = line.trim();\n        var allparts = line.split(':'),\n            parts = [allparts.shift(), allparts.join(':')],\n            lines, fn;\n\n        switch (parts[0].toUpperCase()) {\n            case 'TN':\n                item.title = parts[1].trim();\n                break;\n            case 'SF':\n                item.file = parts.slice(1).join(':').trim();\n                break;\n            case 'FNF':\n                item.functions.found = Number(parts[1].trim());\n                break;\n            case 'FNH':\n                item.functions.hit = Number(parts[1].trim());\n                break;\n            case 'LF':\n                item.lines.found = Number(parts[1].trim());\n                break;\n            case 'LH':\n                item.lines.hit = Number(parts[1].trim());\n                break;\n            case 'DA':\n                lines = parts[1].split(',');\n                item.lines.details.push({\n                    line: Number(lines[0]),\n                    hit: Number(lines[1])\n                });\n                break;\n            case 'FN':\n                fn = parts[1].split(',');\n                item.functions.details.push({\n                    name: fn[1],\n                    line: Number(fn[0])\n                });\n                break;\n            case 'FNDA':\n                fn = parts[1].split(',');\n                item.functions.details.some(function(i, k) {\n                    if (i.name === fn[1] && i.hit === undefined) {\n                        item.functions.details[k].hit = Number(fn[0]);\n                        return true;\n                    }\n                });\n                break;\n            case 'BRDA':\n                fn = parts[1].split(',');\n                item.branches.details.push({\n                    line: Number(fn[0]),\n                    block: Number(fn[1]),\n                    branch: Number(fn[2]),\n                    taken: ((fn[3] === '-') ? 0 : Number(fn[3]))\n                });\n                break;\n            case 'BRF':\n                item.branches.found = Number(parts[1]);\n                break;\n            case 'BRH':\n                item.branches.hit = Number(parts[1]);\n                break;\n        }\n\n        if (line.indexOf('end_of_record') > -1) {\n            data.push(item);\n            item = {\n              lines: {\n                  found: 0,\n                  hit: 0,\n                  details: []\n              },\n              functions: {\n                  hit: 0,\n                  found: 0,\n                  details: []\n              },\n              branches: {\n                hit: 0,\n                found: 0,\n                details: []\n              }\n            };\n        }\n    });\n\n    data.shift();\n\n    if (data.length) {\n        cb(undefined, data);\n    } else {\n        cb('Failed to parse string');\n    }\n};\n\nmodule.exports.parse = function(file, cb) {\n    exists(file, function(x) {\n        if (!x) {\n            return walkFile(file, cb);\n        }\n        fs.readFile(file, 'utf8', function(err, str) {\n            walkFile(str, cb);\n        });\n    });\n\n};\n",
 *       "coverage": [{
 *           "lines": {
 *               "found": 53,
 *               "hit": 53,
 *               "details": [{
 *                   "line": 1,
 *                   "hit": 1
 *               }, {...}]
 *           },
 *           "functions": {
 *               "hit": 6,
 *               "found": 6,
 *               "details": [{
 *                   "name": "(anonymous_0)",
 *                   "line": 7,
 *                   "hit": 3
 *               }, {...}]
 *           },
 *           "branches": {
 *               "hit": 24,
 *               "found": 24,
 *               "details": [{
 *                   "line": 16,
 *                   "block": 0,
 *                   "branch": 0,
 *                   "taken": 4
 *               }, {...}]
 *           },
 *           "title": "",
 *           "source": "",
 *           "file": "/Users/gacsapo/Documents/temp/node-coverage-server/util/lcov.js"
 *       }]
 *   }],
 *   "git": {
 *       "head": {
 *           "id": "07e4ee9f38d7c41fed09a2b93f6ce23c4a2c49da",
 *           "committer_name": "Gabriel Csapo",
 *           "committer_email": "gabecsapo@gmail.com",
 *           "message": "Initial commit",
 *           "author_name": "Gabriel Csapo",
 *           "author_email": "gabecsapo@gmail.com"
 *       },
 *       "branch": "master",
 *       "remotes": [{
 *           "name": "origin",
 *           "url": "https://github.com/gabrielcsapo/node-coverage-server.git"
 *       }]
 *   },
 *   "run_at": "2017-01-17T23:18:16.248Z",
 *   "repo_token": "testing"
 *}
 **/
module.exports = {
    save: (model) => {
      return new Promise((resolve, reject) => {
          MongoClient.connect('mongodb://localhost:32768/node-coverage-server', (err, db) => {
              if (err) return reject(err);
              const collection = db.collection('coverages');
              collection.insertOne(model, (err, result) => {
                if(err) { return reject(err); }
                resolve(result);
              });
          });
      });
    },
    get: (repo) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect('mongodb://localhost:32768/node-coverage-server', (err, db) => {
                if (err) return reject(err);

                const docs = [];
                const collection = db.collection('coverages');
                const options = [{
                    $group: {
                        _id: "$git.remotes.url",
                        history: {
                            $push: "$$ROOT"
                        }
                    }
                }];

                if(repo)
                    options.unshift({ $match: { "git.remotes.url": repo} });

                collection.aggregate(options)
                    .on('data', (doc) => {
                        docs.push(doc);
                    })
                    .once('end', () => {
                        resolve(docs);
                        db.close();
                    });
            });
        });
    }
};
