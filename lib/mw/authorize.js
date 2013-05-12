var cmn = require('muchmala-cmn');
var async = require('async');
var _ = require('lodash');

module.exports = function(redis) {
  var users = new cmn.Users(redis);
  var online = new cmn.db.Online(redis);
  var sign = new cmn.db.Sign(redis);

  return function(socket, payload, next) {
    var auth = payload.req.user || {};

    async.waterfall([
      function(cb) {
        if (!auth.signHash) return cb(null, null);
        // lookup userId with signHash
        sign.get(auth.signHash, cb);
      },
      function(userId, cb) {
        if (userId) {
          users.getUser(userId, cb);
        } else if (auth.userId) {
          users.getUser(auth.userId, cb);
        } else {
          users.createUser(cb);
        }
      },
      function(user, cb) {
        if (user) return cb(null, user);
        users.createUser(cb);
      },
      function(user, cb) {
        payload.user = user;
        // add user to the "online" set
        online.add(user.data.pid, cb);
        // remove user from the "online" set
        // when he is disconnected
        socket.join(user.data.pid);
        socket.on('disconnect', function() {
          online.rm(user.data.pid);
        });
      }
    ], next);
  };
};