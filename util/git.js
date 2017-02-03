/**
 * @module util/git
 */

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const REGEX_BRANCH = /^ref: refs\/heads\/([^?*\[\\~^:]+)$/;

const git = {
  /**
   * @function parse
   * @returns {Promise} - returns a promise that resolves with the git information needed
   */
  parse: () => {
    return new Promise((resolve, reject) => {
      // check if the directory contains git
      if(!fs.existsSync(path.resolve(process.cwd(), '.git'))) {
        return reject('directory does not contain git');
      }

      const git = {
          commit: '',
          author_name: '',
          author_email: '',
          author_date: '',
          committer_name: '',
          committer_email: '',
          committer_date: '',
          message: '',
          branch: '',
          remotes: {
              name: '',
              url: ''
          }
      };

      exec("git log --pretty=format:'%H\n%an\n%ae\n%at\n%cn\n%ce\n%ct\n%s'", {
          cwd: process.cwd()
      }, (err, response) => {
          if (err) {
              return reject(err);
          }
          const raw = response.split('\n');

          git.commit = raw[0];
          git.author_name = raw[1];
          git.author_email = raw[2];
          git.author_date = raw[3];
          git.committer_name = raw[4];
          git.committer_email = raw[5];
          git.committer_date = raw[6];
          git.message = raw[7];
          exec("git remote -v", {
              cwd: process.cwd()
          }, (err, response) => {
              if (err) {
                  return reject(err);
              }
              const head = fs.readFileSync(path.join(process.cwd(), '.git', 'HEAD'), 'utf-8').trim();
              const branch = (head.match(REGEX_BRANCH) || [])[1];
              git.branch = branch;

              response.split("\n").forEach((remote) => {
                  if (!/\s\(push\)$/.test(remote)) {
                      return;
                  }
                  remote = remote.split(/\s+/);
                  git.remotes.name = remote[0];
                  git.remotes.url = remote[1];
              });

              return resolve(git);
          });
      });
    });
  }
};

module.exports = git;
