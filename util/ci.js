module.exports = function() {
  const options = {
    service_job_id: '',
    service_pull_request: '',
    service_name: ''
  };
  
  var match = (process.env.CI_PULL_REQUEST || "").match(/(\d+)$/);

  if (match) {
    options.service_pull_request = match[1];
  }

  if (process.env.TRAVIS){
    options.service_name = 'travis-ci';
    options.service_job_id = process.env.TRAVIS_JOB_ID;
    options.service_pull_request = process.env.TRAVIS_PULL_REQUEST;
  }

  if (process.env.DRONE){
    options.service_name = 'drone';
    options.service_job_id = process.env.DRONE_BUILD_NUMBER;
    options.service_pull_request = process.env.DRONE_PULL_REQUEST;
  }

  if (process.env.JENKINS_URL){
    options.service_name = 'jenkins';
    options.service_job_id = process.env.BUILD_ID;
    options.service_pull_request = process.env.ghprbPullId;
  }

  if (process.env.CIRCLECI){
    options.service_name = 'circleci';
    options.service_job_id = process.env.CIRCLE_BUILD_NUM;

    if (process.env.CI_PULL_REQUEST) {
      var pr = process.env.CI_PULL_REQUEST.split('/pull/');
      options.service_pull_request = pr[1];
    }
  }

  if (process.env.CI_NAME && process.env.CI_NAME === 'codeship'){
    options.service_name = 'codeship';
    options.service_job_id = process.env.CI_BUILD_NUMBER;
  }

  if (process.env.WERCKER){
    options.service_name = 'wercker';
    options.service_job_id = process.env.WERCKER_BUILD_ID;
  }

  if (process.env.GITLAB_CI){
    options.service_name = 'gitlab-ci';
    options.service_job_number = process.env.CI_BUILD_NAME;
    options.service_job_id = process.env.CI_BUILD_ID;
  }
  if(process.env.APPVEYOR){
    options.service_name = 'appveyor';
    options.service_job_number = process.env.APPVEYOR_BUILD_NUMBER;
    options.service_job_id = process.env.APPVEYOR_BUILD_ID;
  }
  if(process.env.SURF_SHA1){
    options.service_name = 'surf';
  }

  if (process.env.COVERALLS_SERVICE_NAME){
    options.service_name = process.env.COVERALLS_SERVICE_NAME;
  }
  if (process.env.COVERALLS_SERVICE_JOB_ID){
    options.service_job_id = process.env.COVERALLS_SERVICE_JOB_ID;
  }

  return options;
};
