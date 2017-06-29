# 0.2.5 (06/29/2017)

- fixes error when data has exceeded 16mbs, uses streams to compensate

# 0.2.4 (05/02/2017)

- updates the directoryHash function to work with different versions of node

# 0.2.3 (05/02/2017)

- fixes cli issues (not setting MONGO_URL correctly)
- fixes issues with directoryHash functionality

# 0.2.2 (05/02/2017)

- check for the version on the server and alert the user to upgrade if the versions are different

# 0.2.1 (04/24/2017)

- fixes issue with git parsing all of the commit logs instead of the most recent

# 0.2.0 (04/17/2017)

- moves mongo operations to mongoose
- uses express, simplifies server logic
- fixes issue where 0/0 is NaN
- make sure the git remotes are set correctly
- does not allow analytics to be pushed without having a git remote setup
- adds tests for node-coverage-cli

# 0.1.1 (03/13/2017)

- fixes the routes for getting coverage data
  - https://github.com/gabrielcsapo/node-coverage-server/commit/300576ffe221006e1b97bfcd1c80912f33ebad5f
- updates main page to show current server version
- gets data from the environment variables to check for any services running
- be able to use node 4 for the node-coverage-cli
  - https://github.com/gabrielcsapo/node-coverage-server/commit/93f35fb78736ed9abdb9da736fb91be721cb435b

# 0.1.0 (03/09/2017)

- adds loading interstitial view for all coverage pages
- separates out some styles into style.css (coverage pages)
- truncates commit message if it is too large
- fixes the coverageFile page to show the correct percentage
- fixes the coverageFile page to show the correct point in history
- updates screenshots
- fixes routes to be more generic
- removes redundant code
- uses git-url-parse to format the urls before being sent to the service

# 0.0.2 (03/08/2017)

- updates travis script
- updates readme to have badge that points to coverage service
- updates package.json to send coverage details to coverage service
- we don't need build dependencies
- remove support for node 4
- minor improvements
  - fixes coverage page using an incorrect interface for CoverageChart
  - fixes coverageFile page to have the same layout as the other coverage pages
    - updates screenshot
  - adds the error on the page to the error view in all coverage pages
  - uses the window location to generate the code snippet on the main page
    - updates screenshots
- captures ci information
- updates main page to show the correct way to get tap coverage
- updates routes to accept ci data from cli
