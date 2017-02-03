const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;

/**
 * @class Coverage
 * @property {string} run_at - the iso date when the coverage was send to the server
 * @property {string} repo_token - the token that references the project on the server
 * @property {Object[]} source_files - a list of all the source files related to the coverage report
 * @property {string} source_files[].name - the name of the file parsed
 * @property {string} source_files[].source - the content of the file parsed into a string
 * @property {Object[]} source_files[].coverage - an array of objects describing the state of the parsed file
 * @property {object} source_files[].coverage[].lines - an object descibing the lines covered in the file
 * @property {number} source_files[].coverage[].lines.found - total number of lines found in the file
 * @property {number} source_files[].coverage[].lines.hits - total number of lines covered in the file
 * @property {Object[]} source_files[].coverage[].lines.details - an array of points in the file that descibes the line and the amount of times it was covered
 * @property {number} source_files[].coverage[].lines.details.line - the line number that is covered
 * @property {number} source_files[].coverage[].lines.details.hit - how many times the line was hit
 * @property {object} source_files[].coverage[].functions - an object descibing the functions covered in the file
 * @property {number} source_files[].coverage[].functions.found - total number of functions found in the file
 * @property {number} source_files[].coverage[].functions.hits - total number of functions covered in the file
 * @property {Object[]} source_files[].coverage[].functions.details - an array of points in the file that descibes the line and the amount of times it was covered
 * @property {number} source_files[].coverage[].functions.details.line - the line number that is covered
 * @property {number} source_files[].coverage[].functions.details.hit - how many times the line was hit
 * @property {object} source_files[].coverage[].branches - an object descibing the branches covered in the file
 * @property {number} source_files[].coverage[].branches.found - total number of branches found in the file
 * @property {number} source_files[].coverage[].branches.hits - total number of branches covered in the file
 * @property {Object[]} source_files[].coverage[].branches.details - an array of points in the file that descibes the line and the amount of times it was covered
 * @property {number} source_files[].coverage[].branches.details.line - the line number that is covered
 * @property {number} source_files[].coverage[].branches.details.hit - how many times the line was hit
 * @property {object} git - the state of the git config at the time of sending coverage
 * @property {object} git.head - git head details
 * @property {string} git.head.id - the commit id
 * @property {string} git.head.committer_name - the committer name
 * @property {string} git.head.committer_email - the committer email
 * @property {string} git.head.message - the commit message
 * @property {string} git.head.author_name - the author of the commit's name
 * @property {string} git.head.author_email - the author of the commit's email
 * @property {string} git.head.branch - the current working branch
 * @property {Object[]} git.head.remotes - an array of all the remotes
 * @property {string} git.head.remotes[].name - the name of the remote
 * @property {string} git.head.remotes[].url - the url of the remote
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
    /**
     * saves a coverage model the collection
     * @function save
     * @memberof Coverage
     * @param  {Coverage} model - the coverage model
     * @return {Promise} - a promise that resolves with the model after it was inserted
     */
    save: (model) => {
      return new Promise((resolve, reject) => {
          MongoClient.connect(MONGO_URL, (err, db) => {
              if (err) return reject(err);
              const collection = db.collection('coverages');
              collection.insertOne(model, (err, result) => {
                if(err) { return reject(err); }
                resolve(result);
              });
          });
      });
    },
    /**
     * gets a repos coverage model or all coverage models
     * @function get
     * @memberof Coverage
     * @param  {string=} repo - the url of the repo
     * @return {Coverage[]} - a promise that resolves with the model after it was inserted
     */
    get: (repo) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URL, (err, db) => {
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
