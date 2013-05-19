var cmn = require('muchmala-cmn');
var async = require('async');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(puzzles, boards) {
  return function(socket, payload, next) {
    var user = payload.user;
    var puzzleId = payload.req.puzzleId;
    var piece1Index = payload.req.piece1Index;
    var piece2Index = payload.req.piece2Index;
    var swapped;

    if (!_.isString(puzzleId)) {
      return next(new e.BadRequest('No puzzleId'))
    }
    if (!_.isNumber(piece1Index)) {
      return next(new e.BadRequest('No piece1Index'))
    }
    if (!_.isNumber(piece2Index)) {
      return next(new e.BadRequest('No piece2Index'))
    }
    
    async.waterfall([
      function(cb) {
        puzzles.isSelected(puzzleId, piece1Index, user.id, cb);
      },
      function(selected, cb) {
        if (!selected) return next(new e.CannotSwap());
        puzzles.selectPiece(puzzleId, piece2Index, user.id, cb);
      },
      function(ttl, cb) {
        puzzles.swapPieces(puzzleId, piece1Index, piece2Index, cb);
      },
      function(pieces, cb) {
        payload.res.swap = {pieces: swapped = pieces};
        puzzles.releasePiece(puzzleId, piece1Index, cb);
      },
      function(cb) {
        puzzles.releasePiece(puzzleId, piece2Index, cb);
      },
      function(cb) {
        puzzles.getPuzzleStatus(puzzleId, cb);
      },
      function(status) {
        async.forEach(_.keys(swapped), function(index, cb) {
          var o = cmn.Piece.getOrigin(swapped[index]);
          if (index != o) return cb();

          var vv = 100 - status;
          var score = _.random(Math.max(vv-10, 5), vv+10);

          payload.res.swap.score || (payload.res.swap.score = {});
          payload.res.swap.score[index] = score;
          boards.shiftUser(user.id, score, cb);
        }, next);
      }
    ], next);
  };
};