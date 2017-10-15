const mongoose = require('mongoose');

/**
 * @class Coverage
 * @property {string} run_at - the iso date when the coverage was send to the server
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
 *       "source": "function d() {\n  return \'hello\';\n}",
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
 *   "run_at": "2017-01-17T23:18:16.248Z"
 *}
 **/

const CoverageModel = new mongoose.Schema({}, { _id: false, strict: false });
const Coverage = mongoose.model('coverages', CoverageModel);

/**
* saves a coverage model the collection
* @function save
* @memberof Coverage
* @param  {Coverage} model - the coverage model
* @return {Promise} - a promise that resolves with the model after it was inserted
*/
module.exports.save = function save(model) {
  return new Promise((resolve, reject) => {
      const { git } = model;
      const _id = `${git.commit}#${git.branch}`;

      model['_id'] = _id;
      Coverage.findOneAndUpdate({
          _id
      }, model, { upsert: true }, (err, result) => {
          if(err) { return reject(err); }
          return resolve(result);
      });
  });
};

/**
 * gets a list of repos
 * @function repos
 * @memberof Coverage
 * @param  {string} repo - the url of the repo
 * @return {Promise} - a promise that resolves with the model after it was inserted
 */
module.exports.repos = function repos(repo) {
  return new Promise((resolve, reject) => {
    let options = {};
    if(repo) {
      options = { "git.remotes.url": repo };
    }

    Coverage.distinct("git.remotes.url", options).exec((err, docs) => {
      if(err) { return reject(err); }
      docs = docs.map((u) => {
        if(u.indexOf('.git') > 0) {
            return u.substr(0, u.indexOf('.git'));
        } else {
          return u;
        }
      }).filter((x, i) => docs.indexOf(x) === i);
      return resolve(docs);
    });
  });
};

/**
 * gets a repos coverage model or all coverage models
 * @function get
 * @memberof Coverage
 * @param  {string} repo - the url of the repo
 * @return {Coverage[]} - a promise that resolves with the model after it was inserted
 */
module.exports.get = function get(repo) {
    return new Promise((resolve, reject) => {
        const options = [
          { $match: { "git.remotes.url": repo } },
          {
            $group: {
                _id: "$git.remotes.url",
                history: {
                    $push: "$$ROOT"
                }
            }
        }];

        Coverage.aggregate(options, (err, docs) => {
            if(err) { return reject(err); }
            return resolve(docs);
        });
    });
};
