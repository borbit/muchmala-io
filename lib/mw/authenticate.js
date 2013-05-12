var cmn = require('muchmala-cmn');

module.exports = function(redis) {
  var users = new cmn.Users(redis)

  return function(socket, payload, next) {
    var authData = payload.req.user;
    if (!authData || !authData.userId) {
      return next(new cmn.errors.AuthenticationFailed());
    }

    users.getUser(authData.userId, function(err, user) {
      if (!user) {
        return next(new cmn.errors.AuthenticationFailed());
      }
      payload.user = user;
      next();
    });
  };
};