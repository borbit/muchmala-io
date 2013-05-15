var cmn = require('muchmala-cmn');
var e = cmn.errors;

module.exports = function(redis) {
  var users = new cmn.Users(redis)

  return function(socket, payload, next) {
    var auth = payload.req.user;

    if (!auth || !auth.userId) {
      return next(new e.AuthenticationFailed());
    }

    users.getUser(auth.userId, function(err, user) {
      if (!user) return next(new e.AuthenticationFailed());
      payload.user = user;
      next();
    });
  };
};