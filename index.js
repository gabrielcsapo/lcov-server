const http = require('http');
const port = 5000;
const routes = require('./routes');
const pathToRegexp = require('path-to-regexp');

const server = http.createServer((request, response) => {
  let found = routes['default'];
  Object.keys(routes).forEach((k) => {
    const keys = [];
    const re = pathToRegexp(k, keys);
    if(re.exec(request.url)) {
      found = routes[k];
      request.params = keys;
    }
  });
  found(request, response);
});

server.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`node-coverage-server is listening on ${port}`); // eslint-disable-line no-console
});
