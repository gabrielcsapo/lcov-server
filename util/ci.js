module.exports = function() {
  const options = {
    service_job_id: '',
    service_pull_request: '',
    service_name: '',
    git_commit: '',
    git_branch: '',
    git_committer_name: '',
    git_committer_email: '',
    git_message: ''
  };

  var match = (process.env.CI_PULL_REQUEST || "").match(/(\d+)$/);

  if (match) {
    options.service_pull_request = match[1];
  }

  if (process.env.TRAVIS){
    options.service_name = 'travis-ci';
    options.service_job_id = process.env.TRAVIS_JOB_ID;
    options.service_pull_request = process.env.TRAVIS_PULL_REQUEST;
    options.git_commit = 'HEAD';
    options.git_branch = process.env.TRAVIS_BRANCH;
  }


  if (process.env.DRONE){
    options.service_name = 'drone';
    options.service_job_id = process.env.DRONE_BUILD_NUMBER;
    options.service_pull_request = process.env.DRONE_PULL_REQUEST;
    options.git_committer_name = process.env.DRONE_COMMIT_AUTHOR;
    options.git_committer_email = process.env.DRONE_COMMIT_AUTHOR_EMAIL;
    options.git_commit = process.env.DRONE_COMMIT;
    options.git_branch = process.env.DRONE_BRANCH;
    options.git_message = process.env.DRONE_COMMIT_MESSAGE;
  }

  if (process.env.JENKINS_URL){
    options.service_name = 'jenkins';
    options.service_job_id = process.env.BUILD_ID;
    options.service_pull_request = process.env.ghprbPullId;
    options.git_commit = process.env.GIT_COMMIT;
    options.git_branch = process.env.GIT_BRANCH;
  }

  if (process.env.CIRCLECI){
    options.service_name = 'circleci';
    options.service_job_id = process.env.CIRCLE_BUILD_NUM;

    if (process.env.CI_PULL_REQUEST) {
      var pr = process.env.CI_PULL_REQUEST.split('/pull/');
      options.service_pull_request = pr[1];
    }
    options.git_commit = process.env.CIRCLE_SHA1;
    options.git_branch = process.env.CIRCLE_BRANCH;
  }

  if (process.env.CI_NAME && process.env.CI_NAME === 'codeship'){
    options.service_name = 'codeship';
    options.service_job_id = process.env.CI_BUILD_NUMBER;
    options.git_commit = process.env.CI_COMMIT_ID;
    options.git_branch = process.env.CI_BRANCH;
    options.git_committer_name = process.env.CI_COMMITTER_NAME;
    options.git_committer_email = process.env.CI_COMMITTER_EMAIL;
    options.git_message = process.env.CI_COMMIT_MESSAGE;
  }

  if (process.env.WERCKER){
    options.service_name = 'wercker';
    options.service_job_id = process.env.WERCKER_BUILD_ID;
    options.git_commit = process.env.WERCKER_GIT_COMMIT;
    options.git_branch = process.env.WERCKER_GIT_BRANCH;
  }

  if (process.env.GITLAB_CI){
    options.service_name = 'gitlab-ci';
    options.service_job_number = process.env.CI_BUILD_NAME;
    options.service_job_id = process.env.CI_BUILD_ID;
    options.git_commit = process.env.CI_BUILD_REF;
    options.git_branch = process.env.CI_BUILD_REF_NAME;
  }
  if(process.env.APPVEYOR){
    options.service_name = 'appveyor';
    options.service_job_number = process.env.APPVEYOR_BUILD_NUMBER;
    options.service_job_id = process.env.APPVEYOR_BUILD_ID;
    options.git_commit = process.env.APPVEYOR_REPO_COMMIT;
    options.git_branch = process.env.APPVEYOR_REPO_BRANCH;
  }
  if(process.env.SURF_SHA1){
    options.service_name = 'surf';
    options.git_commit = process.env.SURF_SHA1;
    options.git_branch = process.env.SURF_REF;
  }

  return options;
};
