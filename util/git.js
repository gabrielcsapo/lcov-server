const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const REGEX_BRANCH = /^ref: refs\/heads\/([^?*\[\\~^:]+)$/;

module.exports = function(callback) {
    // check if the directory contains git
    if(!fs.existsSync(path.resolve(process.cwd(), '.git'))) {
      return callback('directory does not contain git');
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
    }, function(err, response) {
        if (err) {
            return callback(err, undefined);
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
        }, function(err, response) {
            if (err) {
                return callback(err, undefined);
            }
            var head = fs.readFileSync(path.join(process.cwd(), '.git', 'HEAD'), 'utf-8').trim();
            var branch = (head.match(REGEX_BRANCH) || [])[1];
            git.branch = branch;

            response.split("\n").forEach(function(remote) {
                if (!/\s\(push\)$/.test(remote)) {
                    return;
                }
                remote = remote.split(/\s+/);
                git.remotes.name = remote[0];
                git.remotes.url = remote[1];
                callback(undefined, git);
            });
        });
    });
};
