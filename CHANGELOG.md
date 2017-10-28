# 1.1.8 (10/27/2017)

- fixes coverage api to sort before limit is run
- adds more examples to storybook
- fixes error not propagating on main coverage page
- fixes a bug when parsing coverage which stops NaN values from being added to array
- abstracts CLI functionality into library to add more extensive tests

# 1.1.7 (10/25/2017)

- includes moment as a production dependency

# 1.1.6 (10/25/2017)

- uses the correct values for git
- reduces error in calculating coverage points by abstracting to helper method
- ensures that the history is sorted correctly
- fixes the generation of graphs to be more accurate (using total data instead of just a single file)
- fixes the generation of badges to be more accurate (using total data instead of just a single file)
- updates dependencies
- fixes the calculation of source files

# 1.1.5 (10/25/2017)

- guards retrieval of values
- sets the default parser to lcov

# 1.1.4 (10/24/2017)

- removes babel-register, ships a pre-compiled bundle

# 1.1.3 (10/24/2017)

- fixes compatibility with older versions of node <8

# 1.1.2 (10/24/2017)

- fixes location of bin

# 1.1.1 (10/24/2017)

- fixes location of bin

# 1.1.0 (10/24/2017)

- adds the ability to parse `cobertura`, `golang` and `jacoco`
- packages entire application as global executable using pkg
- instantly fails the process if process can't connect to mongo
- adds a limit option to coverage.get to speed up badge generation
- utilizes async await in main router
- utilizes async await in tests
- moved from `psychic-ui` to `psychic.css`
- uses the right environment variables for travis-ci
- compiles module with babel, allowing it to be used over multiple versions of node (previously older versions were not supported)
- sets a limit to only retrieve 10 builds on the list-item view (reduces data on the wire)
- adds viewport meta tag to scale on multiple devices
- adds other meta tags to ensure SEO
- moves version of release to the footer

# 1.0.6 (10/23/2017)

- adds monospace font-family to fileView

# 1.0.5 (10/21/2017)

- fixes a bug that occurs when trying to send data to https server

# 1.0.4 (10/19/2017)

- ensures the commitUrl is properly formed on the file view page

# 1.0.3 (10/19/2017)

- fixes colors not being industry standard

# 1.0.2 (10/14/2017)

- ensures the commitUrl is formed correctly

# 1.0.1 (10/14/2017)

- returns a unique set of repos correctly from `/api/repos`

# 1.0.0 (10/14/2017)

- does not load all content from a single endpoint
  - adds a repo endpoints that gives a list of all unique repo urls
  - coverage list component now allows for pagination and search
- adds syntax highlighting to file view
- adds pagination to builds
- fixes bug with badges that only shows one color
- fixes data integrity gathering the CLI
- creates a single point of entry rather than having lcov-server and lcov-server-cli it is now just lcov-server
  - to upload simply use `lcov-server --upload {url}`
  - to start a server simply use `lcov-server --serve`
- coverage chart can now be filtered by branch name
- fixes commitUrl being incorrectly formed on the coverage page

# 0.1.1 (09/28/2017)

- updates react@16 and reduces bundle size from 343 KB to 313 KB
- updates; express, mongoose, serve-static, @storybook/addon-knobs, @storybook/react, eslint, eslint-plugin-react, getstorybook, prop-types, react, react-dom

# 0.1.0 (09/17/2017)

- removes the versioning from the api endpoints
- abstracts fileView from coverageFile view
- cleans the input lcov before trying to parse it
- actually tests cli code with a pipe from tap

# 0.0.3

- fixes tooltip displaying the correct value for coverage

# 0.0.2

- renders tooltips in the correct place

# 0.0.1

- removes the need for directoryHash
- fixes bug with ci environment discovery that adds empty attributes
- updates dependencies
- updates the directoryHash function to work with different versions of node
- fixes cli issues (not setting MONGO_URL correctly)
- fixes issues with directoryHash functionality
- check for the version on the server and alert the user to upgrade if the versions are different
- fixes issue with git parsing all of the commit logs instead of the most recent
- moves mongo operations to mongoose
- uses express, simplifies server logic
- fixes issue where 0/0 is NaN
- make sure the git remotes are set correctly
- does not allow analytics to be pushed without having a git remote setup
- adds tests for node-coverage-cli
- fixes the routes for getting coverage data
  - https://github.com/gabrielcsapo/lcov-server/commit/300576ffe221006e1b97bfcd1c80912f33ebad5f
- updates main page to show current server version
- gets data from the environment variables to check for any services running
- be able to use node 4 for the node-coverage-cli
  - https://github.com/gabrielcsapo/lcov-server/commit/93f35fb78736ed9abdb9da736fb91be721cb435b
- adds loading interstitial view for all coverage pages
- separates out some styles into style.css (coverage pages)
- truncates commit message if it is too large
- fixes the coverageFile page to show the correct percentage
- fixes the coverageFile page to show the correct point in history
- updates screenshots
- fixes routes to be more generic
- removes redundant code
- uses git-url-parse to format the urls before being sent to the service
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
