var cmn = require('muchmala-cmn');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(puzzles) {
  return function(socket, payload, next) {
    var user = payload.user;
    var puzzleId = payload.req.puzzleId;
    var pieceIndex = payload.req.pieceIndex;

    if (!_.isString(puzzleId)) {
      return next(new e.BadRequest('No puzzleId'))
    }
    if (!_.isNumber(pieceIndex)) {
      return next(new e.BadRequest('No pieceIndex'))
    }

    puzzles.selectPiece(puzzleId, pieceIndex, user.id, function(err, ttl) {
      if (err) return next(err);
      payload.res.selected = {ttl: ttl};
      next();
    });
  };
};