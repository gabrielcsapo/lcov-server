const { Sequelize, DataTypes, Op } = require('sequelize');
const moment = require('moment');

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

 const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

const Coverage = sequelize.define('Coverage', {
  commit: { type: DataTypes.STRING, primaryKey: true },
  source_files: {
    type: DataTypes.JSONB
  },
  git: {
    type: DataTypes.JSONB
  }
}, {});
Coverage.sync({ alter: true })

/**
* saves a coverage model the collection
* @function save
* @memberof Coverage
* @param  {Coverage} model - the coverage model
* @return {Promise} - a promise that resolves with the model after it was inserted
*/
module.exports.save = async function save(model) {
  const { git } = model;
  const commit = `${git.commit}#${git.branch}`;

  console.log(model);

  try {
    const _model = await Coverage.findOne({
      where: {
        commit
      }
    });
    // Create a new coverage model if it doesn't exist
    if(!_model) {
      const coverage = Coverage.build({
        commit,
        ...model
      });
      await coverage.save();
    }
    // Update existing coverage model fields with data sent by the client
    _model.source_files = model.source_files;
    _model.git = model.git;
    _model.run_at;
    await _model.save();
  } catch(ex) {
    console.log(ex);
  }
};

/**
 * gets a list of repos
 * @function repos
 * @memberof Coverage
 * @param  {string} repo - the url of the repo
 * @return {Promise} - a promise that resolves with the model after it was inserted
 */
module.exports.repos = async function repos(repo) {
  const _repos = await Coverage.findAll({
    where: {
      "git.remotes.url": {
        [Op.like]: `%${repo}%`
      }
    },
    attributes: ["git"],
    order: [
      ['updatedAt', 'DESC'],
    ]
  });

  const _remotes = _repos.map((_repo) => {
    const _remote = _repo?.git?.remotes?.url;

    if(_remote.indexOf('.git') > 0) {
      return _remote.substr(0, _remote.indexOf('.git'));
    } else {
      return _remote;
    }
  });

  return [...new Set(_remotes)];
};

/**
 * gets a repos coverage model or all coverage models
 * @function get
 * @memberof Coverage
 * @param  {string} repo - the url of the repo
 * @param  {number=} limit - limit the history of the coverage reports for a specific repo, default is infinite
 * @return {Coverage[]} - a promise that resolves with the model after it was inserted
 */
module.exports.get = async function get(repo, limit) {
    const coverages = await Coverage.findAll({
      where: {
        "git.remotes.url": {
          [Op.like]: `%${repo}%`
        }
      },
      order: [
        ['updatedAt', 'DESC'],
      ]
    });
    
    return {
      id: repo,
      history: coverages
    };
};

module.exports.feed = async function feed(limit=10) {
  return await Coverage.findAll({
    limit: parseInt(limit),
    order: [
      ['updatedAt', 'DESC'],
    ]
  });
};
