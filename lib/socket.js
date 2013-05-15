var socket = require('socket.io-mw');
var cmn = require('muchmala-cmn');
var mw = require('./mw');

exports.createServer = function(server, redis) {
  var io = socket.listen(server);
  
  io.on('user', mw.authorize(redis));
  io.on('user', mw.user());

  io.on(['swap', 'puzzle', 'select', 'release'], mw.authenticate(redis));

  io.on('swap', mw.swap(redis));
  io.on('swap', mw.status(redis));

  io.on('puzzle', mw.puzzle(redis));
  io.on('select', mw.select(redis));
  io.on('release', mw.release(redis));
  
  io.on(['puzzle', 'left', 'select', 'release', 'swap'], mw.broadcast());
  
  return io;
};