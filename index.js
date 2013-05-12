var socket = require('./lib/socket');

exports.createServer = function(config, cb) {
  var http = require('http').createServer();
  var redis = require('redis').createClient();
  var io = socket.createServer(http, redis);

  io.configure(function() {
    io.set('transports', ['websocket']);
    io.set('log level', 2);
  });

  io.configure('production', function () {
    io.set('log level', 1);
  });

  http.listen(config.port, config.host, cb);
};