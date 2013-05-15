var socket = require('socket.io-mw');
var cmn = require('muchmala-cmn');
var mw = require('./mw');

exports.createServer = function(server, redis) {
  var io = socket.listen(server);
  
  var sign = new cmn.db.Sign(redis);
  var users = new cmn.db.Users(redis);
  var online = new cmn.db.Online(redis);
  var puzzles = new cmn.db.Puzzles(redis);
  
  io.on('user', mw.authorize(sign, users, online));
  io.on('user', mw.user());

  io.on(['swap', 'puzzle', 'select', 'release'],
    mw.authenticate(users));

  io.on('swap', mw.swap(puzzles));
  io.on('swap', mw.status(puzzles));

  io.on('puzzle', mw.puzzle(puzzles));
  io.on('select', mw.select(puzzles));
  io.on('release', mw.release(puzzles));
  
  io.on(['puzzle', 'left', 'select', 'release', 'swap'],
    mw.broadcast());
  
  return io;
};