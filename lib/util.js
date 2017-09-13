module.exports.parseBody = function parseBody(req, res, next) {
  let body = '';
  req.on('data', (data) => {
      body += data;
  });
  req.on('end', () => {
    if(req.headers['content-type'] == 'application/json') {
      req.body = JSON.parse(body);
    } else {
      req.body = body;
    }
    next();
  });
};
