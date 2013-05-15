var cmn = require('muchmala-cmn');
var async = require('async');

module.exports = function(redis) {
  var puzzle = new cmn.db.Puzzle(redis);
  
  return function(socket, payload, next) {
    var puzzleId = payload.req.puzzleId;
    
    async.waterfall([
      function(cb) {
        puzzle.getPuzzleStatus(puzzleId, cb)
      },
      function(status, cb) {
        payload.res.status = status;
        if (status < 100) return next();
        puzzle.movePuzzleToEnd(puzzleId, cb);
      },
      function(cb) {
        puzzle.getPieces(puzzleId, cb);
      },
      function(pieces, cb) {
        pieces = cmn.mapper.shuffleMap(pieces);
        puzzle.setPieces(puzzleId, pieces, cb);
      }
    ], next);
  };
};