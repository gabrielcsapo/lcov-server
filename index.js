const http = require('http');
const port = 5000;
const routes = require('./routes');
const pathToRegexp = require('path-to-regexp');

const server = http.createServer((request, response) => {
    let found = routes['default'];
    Object.keys(routes).forEach((k) => {
        const keys = [];
        const re = pathToRegexp(k, keys);
        const result = re.exec(request.url);
        if (result) {
            found = routes[k];
            // parse out the keys into the params object
            // { $name: $value }
            request.params = {};
            if (keys) {
                keys.forEach(function(k, i) {
                    request.params[k.name] = result[i + 1];
                });
            }
        }
    });
    found(request, response);
});

server.listen(port, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`node-coverage-server is listening on ${port}`); // eslint-disable-line
});
