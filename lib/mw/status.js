var cmn = require('muchmala-cmn');
var async = require('async');

module.exports = function(puzzles) {
  return function(socket, payload, next) {
    var puzzleId = payload.req.puzzleId;
    
    async.waterfall([
      function(cb) {
        puzzles.getPuzzleStatus(puzzleId, cb)
      },
      function(status, cb) {
        payload.res.puzzle = {status: status};
        if (status < 100) return next();
        puzzles.movePuzzleToEnd(puzzleId, cb);
      },
      function(cb) {
        puzzles.getPieces(puzzleId, cb);
      },
      function(pieces, cb) {
        pieces = cmn.mapper.shuffleMap(pieces);
        puzzles.setPieces(puzzleId, pieces, cb);
      }
    ], next);
  };
};