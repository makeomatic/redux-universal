#!/usr/bin/env node

const path = require('path');
const sprintf = require('util').format;
const restify = require('restify');
const server = restify.createServer({
  name: 'redux-universal',
  formatters: {
    'text/html': function sendHtml(req, res, body, cb) {
      if (body instanceof Error) {
        return cb(body);
      }

      cb(null, String(body));
    },
  },
});
const middleware = require('../src/server.jsx')();

server.get(/^\/(?!(?:api|assets)\/).*/, middleware);

server.get(/^\/assets\/.*/, restify.serveStatic({
  directory: path.resolve(__dirname, '..'),
}));

server.listen(3000, '0.0.0.0', () => {
  const address = server.address();
  process.stdout.write(sprintf('listening on http://%s:%s\n', address.address, address.port));
});
