const http = require('http');
const port = process.env.PORT || 8080;
const startup = require('./startup');
const routes = require('./routes');
const pathToRegexp = require('path-to-regexp');

startup()
  .then(() => {
    const server = http.createServer((request, response) => {
        let found = routes['default'];
        for(var route in routes) {
          const keys = [];
          const re = pathToRegexp(route, keys);
          const result = re.exec(request.url);
          if (result) {
              found = routes[route];
              // parse out the keys into the params object
              // { $name: $value }
              request.params = {};
              if (keys) {
                  keys.forEach(function(k, i) {
                      request.params[k.name] = result[i + 1];
                  });
              }
          }
        }
        found(request, response);
    });

    server.listen(port, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log(`node-coverage-server is listening on http://localhost:${port}`); // eslint-disable-line
    });
  })
  .catch(function(err) {
    console.error(err);
  });
