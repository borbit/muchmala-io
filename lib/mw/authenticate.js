var cmn = require('muchmala-cmn');
var e = cmn.errors;

module.exports = function(users) {
  return function(socket, payload, next) {
    var auth = payload.req.user;

    if (!auth || !auth.userId) {
      return next(new e.AuthenticationFailed());
    }
    
    users.getUser(auth.userId, function(err, user) {
      if (err) return next(err);
      if (!user) return next(new e.AuthenticationFailed());
      payload.user = user;
      next();
    });
  };
};