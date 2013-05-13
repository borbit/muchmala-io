var cmn = require('muchmala-cmn');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(redis) {
  var puzzle = new cmn.db.Puzzle(redis);
  
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

    puzzle.isSelected(puzzleId, pieceIndex, user.id, function(err, selected) {
      if (err) return next(err);
      if (!selected) return next(new e.CannotRelease());
      puzzle.releasePiece(puzzleId, pieceIndex, next);
    });
  };
};