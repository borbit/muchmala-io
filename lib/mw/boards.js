module.exports = function(boards) {
  return function(socket, payload, next) {
    var res = payload.res;
    if (payload.event != 'user' &&
        payload.event != 'swap') {
      return process.nextTick(next);
    }
    var user = payload.user;
    boards.getUserScores(user.id, function(err, data) {
      if (err) return next(err);
      res.user || (res.user = {});
      res.user.boards = data;
      next();
    });
  };
};