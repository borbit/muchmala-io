var redis = require('redis');
var parse = require('parse-redis-url');
var socket = require('./lib/socket');
redis = parse(redis);

exports.createServer = function(config, cb) {
  var httpClient = require('http').createServer();
  var redisClient = redis.createClient(config.redis);
  var io = socket.createServer(httpClient, redisClient);

  io.configure(function() {
    io.set('transports', ['websocket']);
    io.set('log level', 2);
  });

  io.configure('production', function () {
    io.set('log level', 1);
  });

  httpClient.listen(config.port, config.host, cb);
};
